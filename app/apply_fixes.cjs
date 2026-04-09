const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Add Custom Confluences to Settings
const settingsHtml = `
          <div class="card col-12">
            <div class="stat-label">Custom Confluences</div>
            <p style="font-size: 0.9rem; color: var(--muted); margin-bottom: 20px; line-height: 1.5;">
              Manage the list of confluences available when logging a trade.
            </p>
            <div style="display: flex; gap: 8px; margin-bottom: 16px;">
              <input type="text" id="new-confluence-input" placeholder="Add new confluence..." style="flex: 1; padding: 8px; border-radius: 4px; border: 1px solid var(--border); background: var(--bg); color: var(--text);" />
              <button onclick="addCustomConfluence()" style="background: var(--primary); color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Add</button>
            </div>
            <div id="custom-confluences-list" style="display: flex; flex-wrap: wrap; gap: 8px;">
              <!-- Confluences rendered here -->
            </div>
          </div>
`;
html = html.replace('<div class="stat-label" style="margin-top: 32px">', settingsHtml + '\n            <div class="stat-label" style="margin-top: 32px">');

// 2. Update trade-missed-reason
const oldMissed = `<select id="trade-missed-reason">
            <option value="Hesitation">Hesitation</option>
            <option value="No confirmation">No confirmation</option>
            <option value="Late entry">Late entry</option>
            <option value="Distraction">Distraction</option>
          </select>`;
const newMissed = `<select id="trade-missed-reason" onchange="if(this.value==='Other (custom)') document.getElementById('trade-missed-custom').style.display='block'; else document.getElementById('trade-missed-custom').style.display='none';">
            <option value="Hesitation">Hesitation</option>
            <option value="No confirmation">No confirmation</option>
            <option value="Late entry">Late entry</option>
            <option value="Distraction">Distraction</option>
            <option value="Other (custom)">Other (custom)</option>
          </select>
          <input type="text" id="trade-missed-custom" placeholder="Custom reason" style="display:none; margin-top: 8px; width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--border); background: var(--bg); color: var(--text);" />`;
html = html.replace(oldMissed, newMissed);

// 3. Update trade-setup-type
const oldSetup = `<select id="trade-setup-type">
            <option value="OB">OB (Order Block)</option>
            <option value="FVG">FVG (Fair Value Gap)</option>
            <option value="MSS">MSS (Market Structure Shift)</option>
            <option value="Liquidity Sweep">Liquidity Sweep</option>
            <option value="AMD">AMD (Accumulation, Manipulation, Distribution)</option>
            <option value="Other">Other</option>
          </select>`;
const newSetup = `<input type="text" id="trade-setup-type" list="setup-presets" placeholder="Type or select setup..." style="width: 100%; padding: 8px; border: none; background: transparent; color: var(--text); outline: none;" />
          <datalist id="setup-presets">
            <option value="OB (Order Block)"></option>
            <option value="FVG (Fair Value Gap)"></option>
            <option value="MSS (Market Structure Shift)"></option>
            <option value="Liquidity Sweep"></option>
            <option value="AMD (Accumulation, Manipulation, Distribution)"></option>
          </datalist>`;
html = html.replace(oldSetup, newSetup);

// 4. Update trade-confluence
const oldConfluence = `<div style="display: flex; flex-wrap: wrap; gap: 12px; margin-top: 8px;">
        <label style="display: flex; align-items: center; gap: 4px; font-weight: normal;"><input type="checkbox" class="trade-confluence" value="HTF zone"> HTF zone</label>
        <label style="display: flex; align-items: center; gap: 4px; font-weight: normal;"><input type="checkbox" class="trade-confluence" value="Liquidity taken"> Liquidity taken</label>
        <label style="display: flex; align-items: center; gap: 4px; font-weight: normal;"><input type="checkbox" class="trade-confluence" value="MSS confirmed"> MSS confirmed</label>
        <label style="display: flex; align-items: center; gap: 4px; font-weight: normal;"><input type="checkbox" class="trade-confluence" value="FVG present"> FVG present</label>
        <label style="display: flex; align-items: center; gap: 4px; font-weight: normal;"><input type="checkbox" class="trade-confluence" value="Session timing"> Session timing</label>
        <label style="display: flex; align-items: center; gap: 4px; font-weight: normal;"><input type="checkbox" class="trade-confluence" value="Volume confirmation"> Volume confirmation</label>
      </div>`;
const newConfluence = `<div style="display: flex; flex-wrap: wrap; gap: 12px; margin-top: 8px;" id="trade-confluences-container">
        <!-- Rendered dynamically -->
      </div>`;
html = html.replace(oldConfluence, newConfluence);

// 5. Add Manual Grade
const oldQuality = `<div class="form-group">
        <label>Trade Quality Score (1-10)</label>
        <div class="input-wrapper">
          <i data-lucide="award"></i>
          <input type="number" id="trade-quality-score" min="1" max="10" value="10" />
        </div>
      </div>`;
const newQuality = oldQuality + `
      <div class="form-group">
        <label>Manual Grade</label>
        <div class="input-wrapper">
          <i data-lucide="star"></i>
          <select id="trade-manual-grade">
            <option value="A+">A+</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="Impulsive">Impulsive</option>
          </select>
        </div>
      </div>`;
html = html.replace(oldQuality, newQuality);

// 6. Add Partials HTML
const oldPnlPercent = `<div class="form-group outcome-field">
        <label>Profit/Loss (%)</label>
        <div class="input-wrapper">
          <i data-lucide="percent"></i>
          <input type="number" id="trade-pnl-percent" step="0.01" placeholder="0.00" />
        </div>
      </div>`;
const newPnlPercent = oldPnlPercent + `
      <div class="form-group outcome-field" style="grid-column: span 4;">
        <button type="button" onclick="togglePartials()" style="background: transparent; border: 1px solid var(--border); color: var(--text); padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.9rem;">
          <i data-lucide="layers" style="width: 14px; height: 14px; display: inline-block; vertical-align: middle; margin-right: 4px;"></i> Add Partials
        </button>
        <div id="partials-calculator" style="display: none; margin-top: 12px; padding: 12px; background: rgba(0,0,0,0.2); border-radius: 8px; border: 1px solid var(--border);">
          <div id="partials-list">
            <!-- Rows added here -->
          </div>
          <div style="display: flex; gap: 8px; margin-top: 8px;">
            <button type="button" onclick="addPartialRow()" style="flex: 1; background: var(--bg); border: 1px dashed var(--border); color: var(--text); padding: 6px; border-radius: 4px; cursor: pointer;">+ Add Partial</button>
            <button type="button" onclick="calculateWeightedR()" style="flex: 1; background: var(--primary); border: none; color: white; padding: 6px; border-radius: 4px; cursor: pointer;">Calculate Total R & P/L</button>
          </div>
        </div>
      </div>`;
html = html.replace(oldPnlPercent, newPnlPercent);

// 7. Update Store
html = html.replace('settings: getLocal("qe_settings", {', 'customConfluences: getLocal("qe_custom_confluences", ["HTF zone", "Liquidity taken", "MSS confirmed", "FVG present", "Session timing", "Volume confirmation"]),\n        settings: getLocal("qe_settings", {');
html = html.replace('localStorage.setItem("qe_settings", JSON.stringify(this.settings));', 'localStorage.setItem("qe_custom_confluences", JSON.stringify(this.customConfluences));\n            localStorage.setItem("qe_settings", JSON.stringify(this.settings));');

// 8. Edit Trade Button
const oldDeleteBtn = `<button class="icon-btn" onclick="deleteTrade(\${t.id})" title="Delete Trade">
                            <i data-lucide="trash-2" style="color: var(--danger); width: 16px; height: 16px;"></i>
                        </button>`;
const newDeleteBtn = `<button class="icon-btn" onclick="editTrade(\${t.id})" title="Edit Trade">
                            <i data-lucide="edit" style="color: var(--primary); width: 16px; height: 16px;"></i>
                        </button>
                        ` + oldDeleteBtn;
html = html.replace(oldDeleteBtn, newDeleteBtn);

// 9. JS Functions
const jsFunctions = `
      window.renderConfluences = function() {
        const container = document.getElementById("trade-confluences-container");
        if (!container) return;
        container.innerHTML = "";
        const confluences = Store.customConfluences || ["HTF zone", "Liquidity taken", "MSS confirmed", "FVG present", "Session timing", "Volume confirmation"];
        confluences.forEach(c => {
          container.innerHTML += \`<label style="display: flex; align-items: center; gap: 4px; font-weight: normal;"><input type="checkbox" class="trade-confluence" value="\${c}"> \${c}</label>\`;
        });
      };

      window.renderCustomConfluencesSettings = function() {
        const list = document.getElementById("custom-confluences-list");
        if (!list) return;
        list.innerHTML = "";
        const confluences = Store.customConfluences || [];
        confluences.forEach((c, index) => {
          list.innerHTML += \`
            <div style="display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.05); padding: 4px 8px; border-radius: 4px; border: 1px solid var(--border);">
              <span>\${c}</span>
              <button onclick="deleteCustomConfluence(\${index})" style="background: transparent; border: none; color: var(--danger); cursor: pointer; padding: 0;"><i data-lucide="x" style="width: 14px; height: 14px;"></i></button>
            </div>
          \`;
        });
        lucide.createIcons();
      };

      window.addCustomConfluence = function() {
        const input = document.getElementById("new-confluence-input");
        const val = input.value.trim();
        if (val && !Store.customConfluences.includes(val)) {
          Store.customConfluences.push(val);
          Store.save();
          input.value = "";
          renderCustomConfluencesSettings();
          renderConfluences();
        }
      };

      window.deleteCustomConfluence = function(index) {
        Store.customConfluences.splice(index, 1);
        Store.save();
        renderCustomConfluencesSettings();
        renderConfluences();
      };

      window.editTrade = function (id) {
        const trade = Store.trades.find((t) => t.id === id);
        if (!trade) return;
        
        document.getElementById("trade-account").value = trade.accountId || "";
        document.getElementById("trade-asset").value = trade.asset || "";
        document.getElementById("trade-date").value = trade.date || "";
        document.getElementById("trade-entry-time").value = trade.entryTime || "";
        document.getElementById("trade-exit-time").value = trade.exitTime || "";
        document.getElementById("trade-session").value = trade.session || "";
        document.getElementById("trade-type").value = trade.tradeType || "";
        document.getElementById("trade-execution").value = trade.executionType || "";
        
        document.getElementById("trade-lot-size").value = trade.lotSize || "";
        document.getElementById("trade-entry-price").value = trade.entryPrice || "";
        document.getElementById("trade-sl-price").value = trade.slPrice || "";
        document.getElementById("trade-sl-pips").value = trade.slPips || "";
        document.getElementById("trade-tp-price").value = trade.tpPrice || "";
        document.getElementById("trade-tp-pips").value = trade.tpPips || "";
        document.getElementById("trade-risk-amount").value = trade.riskAmount || "";
        document.getElementById("trade-risk-percent").value = trade.riskPercent || "";
        document.getElementById("trade-account-balance").value = trade.accountBalance || "";
        document.getElementById("trade-planned-r").value = trade.plannedR || "";
        
        document.getElementById("trade-result-type").value = trade.resultType || "Win";
        toggleOutcomeFields();
        document.getElementById("trade-r").value = trade.r || "";
        document.getElementById("trade-pnl-amount").value = trade.pnlAmount || "";
        document.getElementById("trade-pnl-percent").value = trade.pnlPercent || "";
        
        if (trade.resultType === "Missed") {
            const predefined = ["Hesitation", "No confirmation", "Late entry", "Distraction"];
            if (predefined.includes(trade.missedReason)) {
                document.getElementById("trade-missed-reason").value = trade.missedReason;
                document.getElementById("trade-missed-custom").style.display = "none";
            } else {
                document.getElementById("trade-missed-reason").value = "Other (custom)";
                document.getElementById("trade-missed-custom").style.display = "block";
                document.getElementById("trade-missed-custom").value = trade.missedReason || "";
            }
        }
        
        document.getElementById("trade-canceled-reason").value = trade.canceledReason || "";
        
        document.getElementById("trade-htf-bias").value = trade.htfBias || "";
        document.getElementById("trade-entry-tf").value = trade.entryTf || "";
        document.getElementById("trade-setup-type").value = trade.setupType || "";
        
        renderConfluences();
        setTimeout(() => {
            const checkboxes = document.querySelectorAll('.trade-confluence');
            checkboxes.forEach(cb => {
              cb.checked = trade.confluences && trade.confluences.includes(cb.value);
            });
        }, 50);
        
        document.getElementById("trade-quality-score").value = trade.qualityScore || 10;
        document.getElementById("trade-manual-grade").value = trade.manualGrade || "A";
        document.getElementById("trade-rule-adherence").value = trade.ruleAdherence || "Yes";
        toggleRuleExplanation();
        document.getElementById("trade-rule-deviation").value = trade.ruleDeviation || "";
        
        document.getElementById("trade-pre-emotion").value = trade.preEmotion || "";
        document.getElementById("trade-during-emotion").value = trade.duringEmotion || "";
        document.getElementById("trade-post-notes").value = trade.postNotes || "";
        document.getElementById("trade-tags").value = (trade.tags || []).join(", ");
        document.getElementById("trade-screenshot").value = trade.screenshot || "";
        
        window.currentPartialsData = trade.partials || [];
        const list = document.getElementById("partials-list");
        list.innerHTML = "";
        window.currentPartialsData.forEach(p => {
            const row = document.createElement("div");
            row.className = "partial-row";
            row.style.cssText = "display: flex; gap: 8px; margin-bottom: 8px;";
            row.innerHTML = \`
                <input type="number" placeholder="Close Price" class="partial-price" value="\${p.price || ''}" style="flex: 1; padding: 6px; border-radius: 4px; border: 1px solid var(--border); background: var(--bg); color: var(--text);">
                <input type="number" placeholder="Size %" class="partial-size" value="\${p.size || ''}" style="flex: 1; padding: 6px; border-radius: 4px; border: 1px solid var(--border); background: var(--bg); color: var(--text);">
                <input type="number" placeholder="P/L ($)" class="partial-pnl" value="\${p.pnl || ''}" style="flex: 1; padding: 6px; border-radius: 4px; border: 1px solid var(--border); background: var(--bg); color: var(--text);">
                <input type="number" placeholder="Exit R" class="partial-r" value="\${p.r || ''}" style="flex: 1; padding: 6px; border-radius: 4px; border: 1px solid var(--border); background: var(--bg); color: var(--text);">
            \`;
            list.appendChild(row);
        });
        
        window.editingTradeId = id;
        
        openModal('tradeModal');
      };
`;

html = html.replace('window.deleteTrade = function (id) {', jsFunctions + '\n      window.deleteTrade = function (id) {');

// 10. Update saveTrade
const oldSaveTrade = `          missedReason: document.getElementById("trade-missed-reason").value,
          canceledReason: document.getElementById("trade-canceled-reason").value,

          htfBias: document.getElementById("trade-htf-bias").value,
          entryTf: document.getElementById("trade-entry-tf").value,
          setupType: document.getElementById("trade-setup-type").value,
          confluences: confluences,

          qualityScore: parseInt(document.getElementById("trade-quality-score").value) || 10,
          ruleAdherence: ruleAdherence,
          ruleDeviation: ruleExplanation,`;

const newSaveTrade = `          missedReason: document.getElementById("trade-missed-reason").value === 'Other (custom)' ? document.getElementById("trade-missed-custom").value : document.getElementById("trade-missed-reason").value,
          canceledReason: document.getElementById("trade-canceled-reason").value,

          htfBias: document.getElementById("trade-htf-bias").value,
          entryTf: document.getElementById("trade-entry-tf").value,
          setupType: document.getElementById("trade-setup-type").value,
          confluences: confluences,

          qualityScore: parseInt(document.getElementById("trade-quality-score").value) || 10,
          manualGrade: document.getElementById("trade-manual-grade").value,
          ruleAdherence: ruleAdherence,
          ruleDeviation: ruleExplanation,
          partials: window.currentPartialsData || [],`;

html = html.replace(oldSaveTrade, newSaveTrade);

const oldSaveTradeEnd = `        Store.trades.unshift(newTrade);
        Store.save();
        
        if (window.SyncEngine && window.SyncEngine.isSyncing) {
            window.SyncEngine.syncTrade(newTrade);
        }
        
        closeModal();
        renderAll();
      };`;

const newSaveTradeEnd = `        if (window.editingTradeId) {
          const index = Store.trades.findIndex(t => t.id === window.editingTradeId);
          if (index !== -1) {
            newTrade.id = window.editingTradeId;
            newTrade.editHistory = Store.trades[index].editHistory || [];
            newTrade.editHistory.push({
              timestamp: new Date().toISOString(),
              note: "Trade edited"
            });
            Store.trades[index] = newTrade;
          }
          window.editingTradeId = null;
        } else {
          Store.trades.unshift(newTrade);
        }
        
        Store.save();
        
        if (window.SyncEngine && window.SyncEngine.isSyncing) {
            window.SyncEngine.syncTrade(newTrade);
        }
        
        closeModal();
        renderAll();
      };`;

html = html.replace(oldSaveTradeEnd, newSaveTradeEnd);

// 11. Update partials functions
const oldPartials = `      window.addPartialRow = function () {
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
      };`;

const newPartials = `      window.addPartialRow = function () {
        const list = document.getElementById("partials-list");
        const row = document.createElement("div");
        row.className = "partial-row";
        row.style.cssText = "display: flex; gap: 8px; margin-bottom: 8px;";
        row.innerHTML = \`
                <input type="number" placeholder="Close Price" class="partial-price" style="flex: 1; padding: 6px; border-radius: 4px; border: 1px solid var(--border); background: var(--bg); color: var(--text);">
                <input type="number" placeholder="Size %" class="partial-size" style="flex: 1; padding: 6px; border-radius: 4px; border: 1px solid var(--border); background: var(--bg); color: var(--text);">
                <input type="number" placeholder="P/L ($)" class="partial-pnl" style="flex: 1; padding: 6px; border-radius: 4px; border: 1px solid var(--border); background: var(--bg); color: var(--text);">
                <input type="number" placeholder="Exit R" class="partial-r" style="flex: 1; padding: 6px; border-radius: 4px; border: 1px solid var(--border); background: var(--bg); color: var(--text);">
            \`;
        list.appendChild(row);
      };

      window.calculateWeightedR = function () {
        const rows = document.querySelectorAll(".partial-row");
        let totalR = 0;
        let totalSize = 0;
        let totalPnl = 0;
        let partialsData = [];

        rows.forEach((row) => {
          const r = parseFloat(row.querySelector(".partial-r").value) || 0;
          const size = parseFloat(row.querySelector(".partial-size").value) || 0;
          const price = parseFloat(row.querySelector(".partial-price").value) || 0;
          const pnl = parseFloat(row.querySelector(".partial-pnl").value) || 0;
          
          if (size > 0) {
            totalR += r * (size / 100);
            totalSize += size;
            totalPnl += pnl;
            partialsData.push({ r, size, price, pnl });
          }
        });

        if (totalSize > 100) {
          alert("Total size % cannot exceed 100%.");
          return;
        }

        document.getElementById("trade-r").value = totalR.toFixed(2);
        document.getElementById("trade-pnl-amount").value = totalPnl.toFixed(2);
        window.currentPartialsData = partialsData;
        togglePartials();
      };`;

html = html.replace(oldPartials, newPartials);

// Add renderConfluences() and renderCustomConfluencesSettings() to renderAll()
html = html.replace('function renderAll() {', 'function renderAll() {\n        if (typeof renderConfluences === "function") renderConfluences();\n        if (typeof renderCustomConfluencesSettings === "function") renderCustomConfluencesSettings();');

// Add clear editingTradeId to openModal
html = html.replace('function openModal(id) {', 'function openModal(id) {\n        if (id === "tradeModal" && !window.editingTradeId) {\n          window.currentPartialsData = [];\n          document.getElementById("partials-list").innerHTML = "";\n        }');

// Reset editingTradeId when opening modal for new trade
const oldOpenTradeModal = `      window.openTradeModal = function () {
        document.getElementById("trade-date").value = new Date()
          .toISOString()
          .split("T")[0];
        openModal("tradeModal");
      };`;
const newOpenTradeModal = `      window.openTradeModal = function () {
        window.editingTradeId = null;
        document.getElementById("trade-date").value = new Date()
          .toISOString()
          .split("T")[0];
        openModal("tradeModal");
      };`;
html = html.replace(oldOpenTradeModal, newOpenTradeModal);


fs.writeFileSync('index.html', html);
console.log('Update complete');
