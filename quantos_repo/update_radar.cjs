const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const startIdx = html.indexOf('// Calculate Trade Quality');
const endIdx = html.indexOf('const avgQuality =');

const newJS = `// Calculate Trade Quality (based on qualityScore 1-10)
          const totalGradeScore = filteredTrades.reduce(
            (sum, t) => sum + ((t.qualityScore || 5) * 10),
            0
          );
          `;

html = html.substring(0, startIdx) + newJS + html.substring(endIdx);
fs.writeFileSync('index.html', html);
