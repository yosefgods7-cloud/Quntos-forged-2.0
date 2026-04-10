const fs = require('fs');
const path = '/app/applet/quantos_repo/index.html';
let html = fs.readFileSync(path, 'utf8');

const additionalMobileCss = `
        /* Inline grids to full width */
        [style*="grid-template-columns"] {
          grid-template-columns: 1fr !important;
        }
        
        /* Make sure modal content is scrollable and fits */
        .modal {
          max-height: 100vh !important;
          height: 100vh !important;
          max-width: 100vw !important;
          border-radius: 0 !important;
          margin: 0 !important;
          display: flex;
          flex-direction: column;
        }
        
        .modal > div:not(.header) {
          flex: 1;
          overflow-y: auto;
          padding-bottom: 20px;
        }
`;

html = html.replace('/* Forms full width */', additionalMobileCss + '\n        /* Forms full width */');

fs.writeFileSync(path, html);
console.log('Additional mobile fixes applied');
