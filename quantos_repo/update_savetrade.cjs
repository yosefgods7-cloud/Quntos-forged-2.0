const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const newFunctions = `
      window.calculatePlannedRR = function() {
        const entry = parseFloat(document.getElementById("trade-entry-price").value);
        const sl = parseFloat(document.getElementById("trade-sl-price").value);
        const tp = parseFloat(document.getElementById("trade-tp-price").value);
        
        if (!isNaN(entry) && !isNaN(sl) && !isNaN(tp)) {
          const risk = Math.abs(entry - sl);
          const reward = Math.abs(tp - entry);
          if (risk > 0) {
            const rr = (reward / risk).toFixed(2);
            document.getElementById("trade-planned-r").value = rr;
          }
        }
      };

      window.toggleMissedCanceledFields = function() {
        const resultType = document.getElementById("trade-result-type").value;
        const container = document.getElementById("missed-canceled-fields");
        const missedGroup = document.getElementById("missed-reason-group");
        const canceledGroup = document.getElementById("canceled-reason-group");
        
        if (resultType === "Missed") {
          container.style.display = "grid";
          missedGroup.style.display = "block";
          canceledGroup.style.display = "none";
        } else if (resultType === "Canceled") {
          container.style.display = "grid";
          missedGroup.style.display = "none";
          canceledGroup.style.display = "block";
        } else {
          container.style.display = "none";
        }
      };

      window.toggleRuleExplanation = function() {
        const adherence = document.getElementById("trade-rule-adherence").value;
        const explanationGroup = document.getElementById("rule-explanation-group");
        if (adherence === "No") {
          explanationGroup.style.display = "block";
        } else {
          explanationGroup.style.display = "none";
        }
      };

      window.saveTrade = function () {
        const accountId = document.getElementById("trade-account").value;
        const asset = document.getElementById("trade-asset").value;
        const date = document.getElementById("trade-date").value;
        const rMult = parseFloat(document.getElementById("trade-r").value) || 0;

        if (!asset || !date) {
          alert("Please fill in Asset and Date.");
          return;
        }
        
        const ruleAdherence = document.getElementById("trade-rule-adherence").value;
        const ruleExplanation = document.getElementById("trade-rule-explanation").value;
        if (ruleAdherence === "No" && !ruleExplanation.trim()) {
          alert("Please provide an explanation for breaking your rules.");
          return;
        }

        const postNotes = document.getElementById("trade-post-notes").value;
        if (!postNotes.trim()) {
          alert("Post-trade reflection is required.");
          return;
        }

        const entryTime = document.getElementById("trade-entry-time").value;
        const exitTime = document.getElementById("trade-exit-time").value;
        let duration = "-";
        if (entryTime && exitTime) {
          const [eh, em] = entryTime.split(":").map(Number);
          const [xh, xm] = exitTime.split(":").map(Number);
          let diffMins = xh * 60 + xm - (eh * 60 + em);
          if (diffMins < 0) diffMins += 24 * 60; // crossed midnight
          const h = Math.floor(diffMins / 60);
          const m = diffMins % 60;
          duration = \`\${h}h \${m}m\`;
        }

        let isNewsTrade = false;
        if (date && entryTime && window.todayEconomicEvents) {
          const tradeDate = new Date(\`\${date}T\${entryTime}\`);
          if (!isNaN(tradeDate.getTime())) {
            const nearbyHighImpact = window.todayEconomicEvents.some(e => {
              if (e.impact !== 'High') return false;
              const eventDate = new Date(e.date);
              const diffMins = Math.abs((eventDate - tradeDate) / 60000);
              return diffMins <= 60; // Within 60 mins of high impact news
            });
            isNewsTrade = nearbyHighImpact;
          }
        }
        
        const confluenceCheckboxes = document.querySelectorAll('.trade-confluence:checked');
        const confluences = Array.from(confluenceCheckboxes).map(cb => cb.value);

        const newTrade = {
          id: Date.now(),
          accountId: accountId,
          asset,
          date,
          entryTime,
          exitTime,
          duration,
          isNewsTrade,
          session: document.getElementById("trade-session").value,
          tradeType: document.getElementById("trade-type").value,
          executionType: document.getElementById("trade-execution").value,
          
          lotSize: parseFloat(document.getElementById("trade-lot-size").value) || 0,
          entryPrice: parseFloat(document.getElementById("trade-entry-price").value) || 0,
          slPrice: parseFloat(document.getElementById("trade-sl-price").value) || 0,
          tpPrice: parseFloat(document.getElementById("trade-tp-price").value) || 0,
          riskUsd: parseFloat(document.getElementById("trade-risk-usd").value) || 0,
          riskPct: parseFloat(document.getElementById("trade-risk-pct").value) || 0,
          balanceEntry: parseFloat(document.getElementById("trade-balance-entry").value) || 0,
          plannedR: parseFloat(document.getElementById("trade-planned-r").value) || 0,
          
          resultType: document.getElementById("trade-result-type").value,
          r: rMult,
          pnlUsd: parseFloat(document.getElementById("trade-pnl-usd").value) || 0,
          pnlPct: parseFloat(document.getElementById("trade-pnl-pct").value) || 0,
          
          missedReason: document.getElementById("trade-missed-reason").value,
          canceledReason: document.getElementById("trade-canceled-reason").value,
          
          htfBias: document.getElementById("trade-htf-bias").value,
          entryTf: document.getElementById("trade-entry-tf").value,
          setupType: document.getElementById("trade-setup-type").value,
          confluences: confluences,
          
          qualityScore: parseInt(document.getElementById("trade-quality-score").value) || 10,
          ruleAdherence: ruleAdherence,
          ruleExplanation: ruleExplanation,
          
          preEmotion: document.getElementById("trade-pre-emotion").value,
          duringEmotion: document.getElementById("trade-during-emotion").value,
          
          tags: document
            .getElementById("trade-tags")
            .value.split(",")
            .map((t) => t.trim())
            .filter((t) => t),
          screenshot: document.getElementById("trade-screenshot").value,
          preNotes: document.getElementById("trade-pre-notes").value,
          postNotes: postNotes,
        };

        Store.trades.unshift(newTrade);
        Store.save();
        
        if (window.SyncEngine && window.SyncEngine.isSyncing) {
            window.SyncEngine.syncTrade(newTrade);
        }
        
        closeModal();
        renderAll();
      };
`;

const saveTradeStart = html.indexOf('window.saveTrade = function () {');
const saveTradeEnd = html.indexOf('window.deleteTrade = function (id) {');

if (saveTradeStart !== -1 && saveTradeEnd !== -1) {
    html = html.substring(0, saveTradeStart) + newFunctions + html.substring(saveTradeEnd);
    fs.writeFileSync('index.html', html);
    console.log("saveTrade updated");
} else {
    console.log("Could not find saveTrade");
}
