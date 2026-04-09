const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const startIdx = html.indexOf('window.generateTradeInsights = function () {');
const endIdx = html.indexOf('window.generatePerformanceInsight = function () {');

const newJS = `window.generateTradeInsights = function () {
        const recentTrades = Store.trades
          .slice(0, 30)
          .map(
            (t) =>
              \`Asset: \${t.asset}, R: \${t.r}, Duration: \${t.duration || "N/A"}, Plan RR: \${t.plannedR || "N/A"}, Exit RR: \${t.exitR || "N/A"}, Mistake: \${t.ruleDeviation || "None"}, Pre-Emotion: \${t.preEmotion || "None"}, Post-Emotion: \${t.postEmotion || "None"}, Session: \${t.session || "N/A"}, Setup: \${t.setupType || "N/A"}, Notes: \${t.notes || "None"}\`,
          )
          .join("\\n");

        const prompt = \`You are an elite trading coach and quantitative analyst. Analyze the following recent trades (up to 30) from my trading journal.
            
            Recent Trades Data:
            \${recentTrades || "No trades logged yet."}
            
            Please provide a concise, highly actionable analysis covering:
            1. **Psychological Patterns**: Identify recurring emotional triggers or behavioral loops based on the 'Emotion' and 'Mistake' fields.
            2. **Common Mistakes**: What are the most frequent errors (e.g., early exit, FOMO, over-leveraging) and how are they impacting the R-multiple?
            3. **Strategy Improvements**: Based on the Asset, Session, Setup, and Planned vs. Exit RR, what specific adjustments should I make to improve my win rate and profitability?
            
            Keep the response structured with clear headings and bullet points.\`;

        callGemini(prompt, "trade-ai-output", "btn-trade-ai");
      };

      window.generatePsychologyInsight = function () {
        const recentTrades = Store.trades
          .slice(0, 20)
          .map(
            (t) =>
              \`Result: \${t.r}R, Pre-Emotion: \${t.preEmotion || "None"}, Post-Emotion: \${t.postEmotion || "None"}, Mistake: \${t.ruleDeviation || "None"}\`,
          )
          .join("\\n");

        const prompt = \`Analyze the following recent trades (up to 20) focusing purely on trading psychology, emotions, and mistakes.
            
            Recent Trades:
            \${recentTrades || "No trades logged."}
            
            Identify any behavioral patterns (e.g., losing when anxious, specific recurring mistakes) and provide 2 actionable psychological tips to improve discipline.\`;

        callGemini(prompt, "trade-insight-output", "btn-psych-insight");
      };

      `;

html = html.substring(0, startIdx) + newJS + html.substring(endIdx);
fs.writeFileSync('index.html', html);
