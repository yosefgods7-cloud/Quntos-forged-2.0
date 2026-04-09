const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const startIdx = html.indexOf('try {\n          // Trade Journal Stats');
const endIdx = html.indexOf('} catch (e) {\n          console.error("Error in trade journal stats render:", e);\n        }') + 96;

const newJS = `try {
          // Trade Journal Stats
          const totalR = Store.trades.reduce((sum, t) => sum + (t.r || 0), 0);
          const wins = Store.trades.filter((t) => t.r > 0).length;
          const winRate =
            Store.trades.length > 0 ? (wins / Store.trades.length) * 100 : 0;
          const avgR = Store.trades.length > 0 ? totalR / Store.trades.length : 0;
          const totalReturn = Store.trades.reduce((sum, t) => sum + (t.pnlPercent || 0), 0);

          // Best Setup
          const setupStats = {};
          Store.trades.forEach(t => {
              if (t.setupType) {
                  if (!setupStats[t.setupType]) setupStats[t.setupType] = 0;
                  setupStats[t.setupType] += (t.r || 0);
              }
          });
          let bestSetup = "-";
          let maxSetupR = -Infinity;
          for (const [setup, r] of Object.entries(setupStats)) {
              if (r > maxSetupR) {
                  maxSetupR = r;
                  bestSetup = setup;
              }
          }

          // Common Mistake
          const mistakeStats = {};
          Store.trades.forEach(t => {
              if (t.ruleDeviation && t.ruleDeviation.trim() !== "") {
                  const mistake = t.ruleDeviation.substring(0, 20) + "..."; // Simplify
                  if (!mistakeStats[mistake]) mistakeStats[mistake] = 0;
                  mistakeStats[mistake]++;
              }
          });
          let commonMistake = "-";
          let maxMistakeCount = 0;
          for (const [mistake, count] of Object.entries(mistakeStats)) {
              if (count > maxMistakeCount) {
                  maxMistakeCount = count;
                  commonMistake = mistake;
              }
          }

          const tjTotalR = document.getElementById("tj-total-r");
          if (tjTotalR) {
            tjTotalR.innerText = \`\${totalR > 0 ? "+" : ""}\${totalR.toFixed(2)}R\`;
            tjTotalR.style.color = totalR >= 0 ? "var(--success)" : "var(--danger)";
            
            const winRateEl = document.getElementById("tj-win-rate");
            const avgREl = document.getElementById("tj-avg-r");
            const totalReturnEl = document.getElementById("tj-total-return");
            const bestSetupEl = document.getElementById("tj-best-setup");
            const commonMistakeEl = document.getElementById("tj-common-mistake");

            if (winRateEl) winRateEl.innerText = \`\${winRate.toFixed(1)}%\`;
            if (avgREl) {
                avgREl.innerText = \`\${avgR > 0 ? "+" : ""}\${avgR.toFixed(2)}R\`;
                avgREl.style.color = avgR >= 0 ? "var(--success)" : "var(--danger)";
            }
            if (totalReturnEl) {
                totalReturnEl.innerText = \`\${totalReturn > 0 ? "+" : ""}\${totalReturn.toFixed(2)}%\`;
                totalReturnEl.style.color = totalReturn >= 0 ? "var(--success)" : "var(--danger)";
            }
            if (bestSetupEl) bestSetupEl.innerText = bestSetup;
            if (commonMistakeEl) commonMistakeEl.innerText = commonMistake;
          }
        } catch (e) {
          console.error("Error in trade journal stats render:", e);
        }`;

html = html.substring(0, startIdx) + newJS + html.substring(endIdx);
fs.writeFileSync('index.html', html);
