import { FirebaseService } from './firebase.js';
import { doc, setDoc, getDoc, collection, onSnapshot, serverTimestamp } from 'firebase/firestore';

export const SyncEngine = {
  isSyncing: false,
  unsubscribeTrades: null,
  unsubscribeStats: null,
  unsubscribeSettings: null,

  async init() {
    const configStr = localStorage.getItem('firebase_config');
    if (configStr) {
      try {
        const config = JSON.parse(configStr);
        FirebaseService.init(config);
        this.updateStatusUI('Connected', 'var(--success)');
        
        // Show auth section
        const authSection = document.getElementById('auth-section');
        if (authSection) authSection.style.display = 'block';

        // Listen for auth state changes
        FirebaseService.onAuthStateChanged((user) => {
          if (user) {
            this.updateAuthUI(user);
            this.startSync(user.uid);
          } else {
            this.updateAuthUI(null);
            this.stopSync();
          }
        });
      } catch (e) {
        console.error("Failed to init Firebase", e);
        this.updateStatusUI('Failed to connect', 'var(--danger)');
      }
    } else {
      this.updateStatusUI('Offline / Not Configured', 'var(--danger)');
    }
  },

  updateStatusUI(text, color) {
    const textEl = document.getElementById('firebase-status-text');
    const indicatorEl = document.getElementById('firebase-status-indicator');
    if (textEl) textEl.innerText = text;
    if (indicatorEl) indicatorEl.style.background = color;
  },

  updateAuthUI(user) {
    const loggedOut = document.getElementById('auth-logged-out');
    const loggedIn = document.getElementById('auth-logged-in');
    const userEmail = document.getElementById('auth-user-email');
    
    if (user) {
      if (loggedOut) loggedOut.style.display = 'none';
      if (loggedIn) loggedIn.style.display = 'block';
      if (userEmail) userEmail.innerText = user.isAnonymous ? 'Anonymous User' : user.email;
    } else {
      if (loggedOut) loggedOut.style.display = 'block';
      if (loggedIn) loggedIn.style.display = 'none';
    }
  },

  async startSync(userId) {
    if (this.isSyncing) return;
    this.isSyncing = true;
    this.updateStatusUI('Syncing...', 'var(--warning)');
    
    const db = FirebaseService.getDb();
    
    // Sync Trades
    const tradesRef = collection(db, `users/${userId}/trades`);
    this.unsubscribeTrades = onSnapshot(tradesRef, (snapshot) => {
      let localTrades = JSON.parse(localStorage.getItem('qe_trades') || '[]');
      let updated = false;

      snapshot.docChanges().forEach((change) => {
        const data = change.doc.data();
        const tradeId = parseInt(change.doc.id);
        
        if (change.type === 'added' || change.type === 'modified') {
          const index = localTrades.findIndex(t => t.id === tradeId);
          if (index > -1) {
            // Conflict resolution: latest wins
            const localTime = localTrades[index].updatedAt || 0;
            const remoteTime = data.updatedAt?.toMillis ? data.updatedAt.toMillis() : 0;
            if (remoteTime >= localTime) {
              localTrades[index] = { ...data, id: tradeId };
              updated = true;
            }
          } else {
            localTrades.push({ ...data, id: tradeId });
            updated = true;
          }
        } else if (change.type === 'removed') {
          localTrades = localTrades.filter(t => t.id !== tradeId);
          updated = true;
        }
      });

      if (updated) {
        localStorage.setItem('qe_trades', JSON.stringify(localTrades));
        if (window.Store) {
          window.Store.trades = localTrades;
          if (window.renderAll) window.renderAll();
        }
      }
      this.updateStatusUI('Synced', 'var(--success)');
    });

    // Sync Stats/Core
    const coreRef = doc(db, `users/${userId}/stats/core`);
    this.unsubscribeStats = onSnapshot(coreRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (window.Store) {
          if (data.transactions) window.Store.transactions = data.transactions;
          if (data.allocations) window.Store.allocations = data.allocations;
          if (data.wishlist) window.Store.wishlist = data.wishlist;
          if (data.investments) window.Store.investments = data.investments;
          if (data.payouts) window.Store.payouts = data.payouts;
          if (data.milestones) window.Store.milestones = data.milestones;
          if (data.activeTrades) window.Store.activeTrades = data.activeTrades;
          if (data.plannedTrades) window.Store.plannedTrades = data.plannedTrades;
          if (data.backtests) window.Store.backtests = data.backtests;
          if (data.planner) window.Store.planner = data.planner;
          if (data.snapshots) window.Store.snapshots = data.snapshots;
          if (data.scalingMilestones) window.Store.scalingMilestones = data.scalingMilestones;
          
          // Save to local storage without triggering sync loop
          localStorage.setItem("qe_transactions", JSON.stringify(window.Store.transactions));
          localStorage.setItem("qe_allocations", JSON.stringify(window.Store.allocations));
          localStorage.setItem("qe_wishlist", JSON.stringify(window.Store.wishlist));
          localStorage.setItem("qe_investments", JSON.stringify(window.Store.investments));
          localStorage.setItem("qe_payouts", JSON.stringify(window.Store.payouts));
          localStorage.setItem("qe_milestones", JSON.stringify(window.Store.milestones));
          localStorage.setItem("qe_active_trades", JSON.stringify(window.Store.activeTrades));
          localStorage.setItem("qe_planned_trades", JSON.stringify(window.Store.plannedTrades));
          localStorage.setItem("qe_backtests", JSON.stringify(window.Store.backtests));
          localStorage.setItem("qe_planner", JSON.stringify(window.Store.planner));
          localStorage.setItem("qe_snapshots", JSON.stringify(window.Store.snapshots));
          localStorage.setItem("qe_scaling_milestones", JSON.stringify(window.Store.scalingMilestones));
          
          if (window.renderAll) window.renderAll();
        }
      }
    });

    // Sync Accounts
    const accountsRef = doc(db, `users/${userId}/stats/accounts`);
    onSnapshot(accountsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (window.Store && data.data) {
          window.Store.accounts = data.data;
          localStorage.setItem("qe_accounts", JSON.stringify(window.Store.accounts));
          if (window.renderAll) window.renderAll();
        }
      }
    });

    // Sync Settings
    const settingsRef = doc(db, `users/${userId}/settings/main`);
    this.unsubscribeSettings = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (window.Store) {
          window.Store.settings = { ...window.Store.settings, ...data };
          localStorage.setItem("qe_settings", JSON.stringify(window.Store.settings));
          if (window.renderAll) window.renderAll();
        }
      }
    });
  },

  stopSync() {
    this.isSyncing = false;
    if (this.unsubscribeTrades) this.unsubscribeTrades();
    if (this.unsubscribeStats) this.unsubscribeStats();
    if (this.unsubscribeSettings) this.unsubscribeSettings();
    this.updateStatusUI('Offline', 'var(--danger)');
  },

  async syncTrade(trade) {
    if (!this.isSyncing) return;
    try {
      const db = FirebaseService.getDb();
      const auth = FirebaseService.getAuth();
      if (!auth.currentUser) return;
      
      const tradeRef = doc(db, `users/${auth.currentUser.uid}/trades/${trade.id}`);
      await setDoc(tradeRef, {
        ...trade,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (e) {
      console.error("Failed to sync trade", e);
    }
  },

  async syncAll(store) {
    if (!this.isSyncing) return;
    try {
      const db = FirebaseService.getDb();
      const auth = FirebaseService.getAuth();
      if (!auth.currentUser) return;
      
      const uid = auth.currentUser.uid;
      
      // Sync settings
      if (store.settings) {
        await setDoc(doc(db, `users/${uid}/settings/main`), {
          ...store.settings,
          updatedAt: serverTimestamp()
        }, { merge: true });
      }

      // Sync stats/accounts
      if (store.accounts) {
        await setDoc(doc(db, `users/${uid}/stats/accounts`), {
          data: store.accounts,
          updatedAt: serverTimestamp()
        }, { merge: true });
      }
      
      // Sync other core data
      const coreData = {
        transactions: store.transactions || [],
        allocations: store.allocations || [],
        wishlist: store.wishlist || [],
        investments: store.investments || [],
        payouts: store.payouts || [],
        milestones: store.milestones || [],
        activeTrades: store.activeTrades || [],
        plannedTrades: store.plannedTrades || [],
        backtests: store.backtests || [],
        planner: store.planner || {},
        snapshots: store.snapshots || {},
        scalingMilestones: store.scalingMilestones || []
      };
      
      await setDoc(doc(db, `users/${uid}/stats/core`), {
        ...coreData,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
    } catch (e) {
      console.error("Failed to sync all data", e);
    }
  },

  async deleteTrade(tradeId) {
    if (!this.isSyncing) return;
    try {
      const db = FirebaseService.getDb();
      const auth = FirebaseService.getAuth();
      if (!auth.currentUser) return;
      
      const tradeRef = doc(db, `users/${auth.currentUser.uid}/trades/${tradeId}`);
      await deleteDoc(tradeRef);
    } catch (e) {
      console.error("Failed to delete trade", e);
    }
  }
};

// Expose global functions for the UI
window.SyncEngine = SyncEngine;

window.saveFirebaseConfig = function() {
  const config = {
    apiKey: document.getElementById('fb-apiKey').value,
    authDomain: document.getElementById('fb-authDomain').value,
    projectId: document.getElementById('fb-projectId').value,
    storageBucket: document.getElementById('fb-storageBucket').value,
    messagingSenderId: document.getElementById('fb-messagingSenderId').value,
    appId: document.getElementById('fb-appId').value
  };
  
  if (!config.apiKey || !config.projectId) {
    alert("API Key and Project ID are required.");
    return;
  }
  
  localStorage.setItem('firebase_config', JSON.stringify(config));
  SyncEngine.init();
};

window.clearFirebaseConfig = function() {
  localStorage.removeItem('firebase_config');
  document.getElementById('fb-apiKey').value = '';
  document.getElementById('fb-authDomain').value = '';
  document.getElementById('fb-projectId').value = '';
  document.getElementById('fb-storageBucket').value = '';
  document.getElementById('fb-messagingSenderId').value = '';
  document.getElementById('fb-appId').value = '';
  
  const authSection = document.getElementById('auth-section');
  if (authSection) authSection.style.display = 'none';
  
  SyncEngine.stopSync();
  SyncEngine.updateStatusUI('Offline / Not Configured', 'var(--danger)');
};

window.handleLogin = async function() {
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;
  if (!email || !password) return alert("Email and password required");
  
  try {
    await FirebaseService.login(email, password);
  } catch (e) {
    alert("Login failed: " + e.message);
  }
};

window.handleSignup = async function() {
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;
  if (!email || !password) return alert("Email and password required");
  
  try {
    await FirebaseService.signup(email, password);
  } catch (e) {
    alert("Signup failed: " + e.message);
  }
};

window.handleAnonLogin = async function() {
  try {
    await FirebaseService.loginAnonymously();
  } catch (e) {
    alert("Anon login failed: " + e.message);
  }
};

window.handleLogout = async function() {
  try {
    await FirebaseService.logout();
  } catch (e) {
    alert("Logout failed: " + e.message);
  }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  const configStr = localStorage.getItem('firebase_config');
  if (configStr) {
    const config = JSON.parse(configStr);
    if (document.getElementById('fb-apiKey')) {
      document.getElementById('fb-apiKey').value = config.apiKey || '';
      document.getElementById('fb-authDomain').value = config.authDomain || '';
      document.getElementById('fb-projectId').value = config.projectId || '';
      document.getElementById('fb-storageBucket').value = config.storageBucket || '';
      document.getElementById('fb-messagingSenderId').value = config.messagingSenderId || '';
      document.getElementById('fb-appId').value = config.appId || '';
    }
  }
  SyncEngine.init();
});
