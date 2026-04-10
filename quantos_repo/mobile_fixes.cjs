const fs = require('fs');
const path = '/app/applet/quantos_repo/index.html';
let html = fs.readFileSync(path, 'utf8');

// 1. Add mobile nav HTML
const mobileNavHtml = `
    <!-- Mobile Header -->
    <header id="mobile-header" class="mobile-header">
      <div class="brand" style="padding: 0; border: none;">
        <i data-lucide="shield-check" style="color: var(--primary)"></i>
        <span>QuantEdge</span>
      </div>
      <button class="icon-btn" onclick="document.getElementById('app-sidebar').classList.toggle('mobile-open')">
        <i data-lucide="menu"></i>
      </button>
    </header>

    <!-- Mobile Bottom Nav -->
    <nav id="mobile-nav" class="mobile-nav minimized">
      <div class="mobile-nav-handle" onclick="document.getElementById('mobile-nav').classList.toggle('minimized')">
        <div class="handle-bar"></div>
      </div>
      <div class="mobile-nav-content">
        <div class="mobile-nav-item active" onclick="switchView('dashboard')">
          <i data-lucide="layout-dashboard"></i>
          <span class="mobile-nav-label">Dashboard</span>
        </div>
        <div class="mobile-nav-item" onclick="switchView('trade-journal')">
          <i data-lucide="book-open"></i>
          <span class="mobile-nav-label">Journal</span>
        </div>
        <div class="mobile-nav-item fab" onclick="openModal('add-trade')">
          <i data-lucide="plus"></i>
        </div>
        <div class="mobile-nav-item" onclick="switchView('strategy')">
          <i data-lucide="pie-chart"></i>
          <span class="mobile-nav-label">Analytics</span>
        </div>
        <div class="mobile-nav-item" onclick="switchView('settings')">
          <i data-lucide="settings"></i>
          <span class="mobile-nav-label">Settings</span>
        </div>
      </div>
    </nav>
`;

if (!html.includes('id="mobile-nav"')) {
    html = html.replace('<aside id="app-sidebar"', mobileNavHtml + '\n    <aside id="app-sidebar"');
}

// 2. Add Mobile CSS
const mobileCss = `
      /* --- MOBILE FIRST & RESPONSIVE --- */
      .mobile-header {
        display: none;
        justify-content: space-between;
        align-items: center;
        padding: 12px 20px;
        background: var(--bg);
        border-bottom: 1px solid var(--border);
        z-index: 40;
        position: sticky;
        top: 0;
      }

      .mobile-nav {
        display: none;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: var(--card);
        border-top: 1px solid var(--border);
        z-index: 100;
        padding-bottom: env(safe-area-inset-bottom);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border-radius: 20px 20px 0 0;
        box-shadow: 0 -4px 20px rgba(0,0,0,0.2);
      }

      .mobile-nav.hidden {
        transform: translateY(100%);
      }

      .mobile-nav-content {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 12px 8px;
      }

      .mobile-nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        color: var(--muted);
        cursor: pointer;
        transition: color 0.2s;
        flex: 1;
        padding: 8px 0;
        -webkit-tap-highlight-color: transparent;
      }

      .mobile-nav-item.active {
        color: var(--primary);
      }

      .mobile-nav-item i {
        width: 24px;
        height: 24px;
      }

      .mobile-nav-label {
        font-size: 0.7rem;
        font-weight: 500;
        transition: opacity 0.2s, height 0.2s, margin 0.2s;
      }

      .mobile-nav.minimized .mobile-nav-label {
        opacity: 0;
        height: 0;
        margin: 0;
        overflow: hidden;
      }

      .mobile-nav-item.fab {
        background: var(--primary);
        color: white;
        border-radius: 50%;
        width: 56px;
        height: 56px;
        justify-content: center;
        flex: none;
        margin: -20px 8px 0;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        border: 4px solid var(--bg);
      }

      .mobile-nav-handle {
        width: 100%;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: transparent;
        cursor: pointer;
      }

      .handle-bar {
        width: 40px;
        height: 4px;
        background: var(--border);
        border-radius: 2px;
      }

      @media (max-width: 768px) {
        body {
          flex-direction: column;
        }
        
        #app-sidebar {
          position: fixed;
          top: 0;
          left: -100%;
          height: 100vh;
          width: 80vw;
          max-width: 300px;
          transition: left 0.3s ease;
          box-shadow: 4px 0 24px rgba(0,0,0,0.5);
        }

        #app-sidebar.mobile-open {
          left: 0;
        }

        .mobile-header {
          display: flex;
        }

        .mobile-nav {
          display: block;
        }

        main {
          padding: 16px 16px 80px 16px !important; /* Extra padding for bottom nav */
        }

        .header {
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-10, .col-11, .col-12 {
          grid-column: span 12 !important;
        }

        .card {
          padding: 16px;
        }

        .stat-value {
          font-size: 1.5rem;
        }

        /* Forms full width */
        .form-grid {
          grid-template-columns: 1fr !important;
        }

        /* Modals full screen */
        .modal-content {
          width: 100% !important;
          height: 100% !important;
          max-height: 100vh !important;
          border-radius: 0 !important;
          padding: 20px !important;
        }
        
        .modal-body {
          max-height: calc(100vh - 120px) !important;
        }

        /* Tables scrollable */
        .table-container {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          margin: 0 -16px;
          padding: 0 16px;
        }
      }
`;

// Replace old media query
const oldMediaQuery = `@media (max-width: 768px) {
        :root {
          --sidebar-width: 60px;
        }
        .brand {
          padding: 20px 0;
          justify-content: center;
        }
        .brand span,
        .nav-item span,
        .stat-label span,
        .heartbeat + span {
          display: none;
        }
        .nav-item {
          padding: 12px;
          justify-content: center;
        }
        .nav-item i {
          margin-right: 0;
        }
      }`;

if (html.includes(oldMediaQuery)) {
    html = html.replace(oldMediaQuery, mobileCss);
} else {
    // If not found, just append before </style>
    html = html.replace('</style>', mobileCss + '\n    </style>');
}

// 3. Add Scroll Logic for Auto-hide
const scrollLogic = `
      // Mobile Nav Scroll Logic
      let lastScrollY = 0;
      const mainEl = document.querySelector('main');
      if (mainEl) {
        mainEl.addEventListener('scroll', () => {
          if (window.innerWidth > 768) return;
          const currentScrollY = mainEl.scrollTop;
          const mobileNav = document.getElementById('mobile-nav');
          if (!mobileNav) return;
          
          if (currentScrollY > lastScrollY && currentScrollY > 50) {
            // Scrolling down
            mobileNav.classList.add('hidden');
          } else {
            // Scrolling up
            mobileNav.classList.remove('hidden');
          }
          lastScrollY = currentScrollY;
        }, { passive: true });
      }

      // Update active state in mobile nav
      const originalSwitchView = window.switchView;
      window.switchView = function(viewId) {
        if (originalSwitchView) originalSwitchView(viewId);
        
        // Update mobile nav
        document.querySelectorAll('.mobile-nav-item').forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('onclick') && item.getAttribute('onclick').includes(viewId)) {
            item.classList.add('active');
          }
        });
        
        // Close sidebar if open
        const sidebar = document.getElementById('app-sidebar');
        if (sidebar) sidebar.classList.remove('mobile-open');
      };
`;

html = html.replace('// --- Theme Toggle Logic ---', scrollLogic + '\n      // --- Theme Toggle Logic ---');

fs.writeFileSync(path, html);
console.log('Mobile fixes applied');
