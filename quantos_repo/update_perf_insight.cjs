const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const startIdx = html.indexOf('window.generatePerformanceInsight = function () {');
const endIdx = html.indexOf('window.generateAllocationInsight = function () {');

const newJS = `window.generatePerformanceInsight = function () {
        const totalR = Store.trades.reduce((sum, t) => sum + (t.r || 0), 0);
        const wins = Store.trades.filter((t) => t.r > 0).length;
        const winRate =
          Store.trades.length > 0 ? (wins / Store.trades.length) * 100 : 0;
        const recentTrades = Store.trades
          .slice(0, 30)
          .map(
            (t) =>
              \`Asset: \${t.asset}, Session: \${t.session}, Setup: \${t.setupType}, Quality: \${t.qualityScore}, Result: \${t.r}R\`,
          )
          .join("\\n");

        const prompt = \`Analyze the following trading performance data.
            
            Overall Stats: Total R: \${totalR}, Win Rate: \${winRate.toFixed(1)}%
            
            Recent Trades (up to 30):
            \${recentTrades || "No trades logged."}
            
            Identify which assets, sessions, or setups are performing best/worst. Provide 2-3 actionable suggestions on what to focus on or avoid.\`;

        callGemini(prompt, "trade-insight-output", "btn-perf-insight");
      };

      `;

html = html.substring(0, startIdx) + newJS + html.substring(endIdx);
fs.writeFileSync('index.html', html);
