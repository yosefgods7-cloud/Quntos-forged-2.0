const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const startIdx = html.indexOf('window.togglePartials = function () {');
const endIdx = html.indexOf('window.deleteTrade = function (id) {');

const newJS = `
      window.togglePartials = function () {
        const el = document.getElementById("partials-calculator");
        el.style.display = el.style.display === "none" ? "block" : "none";
      };

      window.addPartialRow = function () {
        const list = document.getElementById("partials-list");
        const row = document.createElement("div");
        row.className = "partial-row";
        row.style.cssText = "display: flex; gap: 8px; margin-bottom: 8px;";
        row.innerHTML = \`
                <input type="number" placeholder="Exit R" class="partial-r" style="flex: 1; padding: 6px; border-radius: 4px; border: 1px solid var(--border); background: var(--bg); color: var(--text);">
                <input type="number" placeholder="Size %" class="partial-size" style="flex: 1; padding: 6px; border-radius: 4px; border: 1px solid var(--border); background: var(--bg); color: var(--text);">
            \`;
        list.appendChild(row);
      };

      window.calculateWeightedR = function () {
        const rows = document.querySelectorAll(".partial-row");
        let totalR = 0;
        let totalSize = 0;

        rows.forEach((row) => {
          const r = parseFloat(row.querySelector(".partial-r").value);
          const size = parseFloat(row.querySelector(".partial-size").value);
          if (!isNaN(r) && !isNaN(size)) {
            totalR += r * (size / 100);
            totalSize += size;
          }
        });

        if (totalSize > 100) {
          alert("Total size % cannot exceed 100%.");
          return;
        }

        document.getElementById("trade-r").value = totalR.toFixed(2);
        togglePartials();
      };

      window.calculateRR = function() {
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

      window.toggleOutcomeFields = function() {
        const resultType = document.getElementById("trade-result-type").value;
        const outcomeFields = document.querySelectorAll(".outcome-field");
        const missedField = document.querySelector(".missed-field");
        const canceledField = document.querySelector(".canceled-field");
        
        if (resultType === "Missed") {
          outcomeFields.forEach(f => f.style.display = "none");
          missedField.style.display = "block";
          canceledField.style.display = "none";
        } else if (resultType === "Canceled") {
          outcomeFields.forEach(f => f.style.display = "none");
          missedField.style.display = "none";
          canceledField.style.display = "block";
        } else {
          outcomeFields.forEach(f => f.style.display = "block");
          missedField.style.display = "none";
          canceledField.style.display = "none";
        }
      };

      window.toggleRuleExplanation = function() {
        const adherence = document.getElementById("trade-rule-adherence").value;
        const explanationGroup = document.querySelector(".rule-explanation-field");
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
        const resultType = document.getElementById("trade-result-type").value;
        
        if (!asset || !date) {
          alert("Please fill in Asset and Date.");
          return;
        }
        
        const ruleAdherence = document.getElementById("trade-rule-adherence").value;
        const ruleExplanation = document.getElementById("trade-rule-deviation").value;
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

        const confluences = Array.from(document.querySelectorAll('.trade-confluence:checked')).map(cb => cb.value);

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
          slPips: parseFloat(document.getElementById("trade-sl-pips").value) || 0,
          tpPrice: parseFloat(document.getElementById("trade-tp-price").value) || 0,
          tpPips: parseFloat(document.getElementById("trade-tp-pips").value) || 0,
          riskAmount: parseFloat(document.getElementById("trade-risk-amount").value) || 0,
          riskPercent: parseFloat(document.getElementById("trade-risk-percent").value) || 0,
          accountBalance: parseFloat(document.getElementById("trade-account-balance").value) || 0,
          plannedR: parseFloat(document.getElementById("trade-planned-r").value) || 0,

          resultType: resultType,
          r: parseFloat(document.getElementById("trade-r").value) || 0,
          pnlAmount: parseFloat(document.getElementById("trade-pnl-amount").value) || 0,
          pnlPercent: parseFloat(document.getElementById("trade-pnl-percent").value) || 0,
          missedReason: document.getElementById("trade-missed-reason").value,
          canceledReason: document.getElementById("trade-canceled-reason").value,

          htfBias: document.getElementById("trade-htf-bias").value,
          entryTf: document.getElementById("trade-entry-tf").value,
          setupType: document.getElementById("trade-setup-type").value,
          confluences: confluences,

          qualityScore: parseInt(document.getElementById("trade-quality-score").value) || 10,
          ruleAdherence: ruleAdherence,
          ruleDeviation: ruleExplanation,

          preEmotion: document.getElementById("trade-pre-emotion").value,
          duringEmotion: document.getElementById("trade-during-emotion").value,
          postNotes: postNotes,

          tags: document.getElementById("trade-tags").value.split(",").map(t => t.trim()).filter(t => t),
          screenshot: document.getElementById("trade-screenshot").value,
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

html = html.substring(0, startIdx) + newJS + html.substring(endIdx);
fs.writeFileSync('index.html', html);
