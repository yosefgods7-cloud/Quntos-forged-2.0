const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const startIdx = html.indexOf('// Calculate emotion score (average of last 10 psychScore)');
const endIdx = html.indexOf('const emotionPct = (avgPsychScore / 10) * 100;');

const newJS = `// Calculate emotion score (average of last 10 trades based on pre/post emotions)
        const emotionScores = {
            "Calm": 10, "Confident": 8, "Hesitation": 5, "Fear": 3, "Greed": 2, "Overconfidence": 2,
            "Disciplined": 10, "Patient": 8, "Emotional": 3, "Impulsive": 2
        };
        let totalPsychScore = 0;
        let psychCount = 0;
        recentTrades.forEach((t) => {
            let tradeScore = 0;
            let tradeCount = 0;
            if (t.preEmotion && t.preEmotion.length > 0) {
                t.preEmotion.forEach(e => {
                    if (emotionScores[e]) { tradeScore += emotionScores[e]; tradeCount++; }
                });
            }
            if (t.postEmotion && t.postEmotion.length > 0) {
                t.postEmotion.forEach(e => {
                    if (emotionScores[e]) { tradeScore += emotionScores[e]; tradeCount++; }
                });
            }
            if (tradeCount > 0) {
                totalPsychScore += (tradeScore / tradeCount);
                psychCount++;
            }
        });
        const avgPsychScore = psychCount > 0 ? totalPsychScore / psychCount : 10;
        `;

html = html.substring(0, startIdx) + newJS + html.substring(endIdx);
fs.writeFileSync('index.html', html);
