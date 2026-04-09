const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const startIdx = html.indexOf('// Grade Distribution Data');
const endIdx = html.indexOf('window.tradeQualityObj = new Chart');

const newJS = `// Quality Score Distribution Data
        const grades = { "9-10 (A+)": 0, "7-8 (A)": 0, "5-6 (B)": 0, "<5 (C)": 0 };
        Store.trades.forEach((t) => {
          const score = t.qualityScore || 0;
          if (score >= 9) grades["9-10 (A+)"]++;
          else if (score >= 7) grades["7-8 (A)"]++;
          else if (score >= 5) grades["5-6 (B)"]++;
          else grades["<5 (C)"]++;
        });

        `;

html = html.substring(0, startIdx) + newJS + html.substring(endIdx);
fs.writeFileSync('index.html', html);
