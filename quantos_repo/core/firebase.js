import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence, collection, doc, setDoc, getDoc, getDocs, onSnapshot, query, where, orderBy, serverTimestamp, deleteDoc } from "firebase/firestore";

let app;
let auth;
let db;

export const FirebaseService = {
  isInitialized: false,

  init(config) {
    if (this.isInitialized) return { app, auth, db };
    
    if (!getApps().length) {
      app = initializeApp(config);
    } else {
      app = getApp();
    }

    auth = getAuth(app);
    db = getFirestore(app);

    // Try to enable offline persistence
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code == 'failed-precondition') {
        console.warn("Firebase persistence failed: Multiple tabs open.");
      } else if (err.code == 'unimplemented') {
        console.warn("Firebase persistence failed: Browser doesn't support it.");
      }
    });

    this.isInitialized = true;
    return { app, auth, db };
  },

  getAuth() {
    if (!this.isInitialized) throw new Error("Firebase not initialized");
    return auth;
  },

  getDb() {
    if (!this.isInitialized) throw new Error("Firebase not initialized");
    return db;
  },

  async login(email, password) {
    if (!auth) throw new Error("Firebase not initialized");
    return signInWithEmailAndPassword(auth, email, password);
  },

  async signup(email, password) {
    if (!auth) throw new Error("Firebase not initialized");
    return createUserWithEmailAndPassword(auth, email, password);
  },

  async loginAnonymously() {
    if (!auth) throw new Error("Firebase not initialized");
    return signInAnonymously(auth);
  },

  async logout() {
    if (!auth) throw new Error("Firebase not initialized");
    return signOut(auth);
  },

  onAuthStateChanged(callback) {
    if (!auth) return () => {};
    return onAuthStateChanged(auth, callback);
  }
};
