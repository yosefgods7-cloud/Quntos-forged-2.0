const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const startIdx = html.indexOf('window.renderTradeTable = function () {');
const endIdx = html.indexOf('window.saveBacktest = function () {');

const newJS = `window.renderTradeTable = function () {
        const assetFilter = document.getElementById("filter-asset").value;
        const sessionFilter = document.getElementById("filter-session").value;

        const filteredTrades = Store.trades.filter((t) => {
          const assetMatch = assetFilter === "All" || t.asset === assetFilter;
          const sessionMatch =
            sessionFilter === "All" || t.session === sessionFilter;
          return assetMatch && sessionMatch;
        });

        renderTable(
          "trades-table-body",
          filteredTrades,
          (t) => {
            let resultColor = "var(--muted)";
            if (t.resultType === "Win" || t.resultType === "Partial Win") resultColor = "var(--success)";
            else if (t.resultType === "Loss") resultColor = "var(--danger)";
            else if (t.resultType === "Break Even") resultColor = "var(--warning)";

            let pnlColor = "var(--muted)";
            if (t.pnlAmount > 0) pnlColor = "var(--success)";
            else if (t.pnlAmount < 0) pnlColor = "var(--danger)";

            return \`
                <tr>
                    <td>\${t.date} \${t.entryTime || ""}</td>
                    <td style="font-weight: 600;">\${t.asset}</td>
                    <td>\${t.session || "-"}</td>
                    <td><span class="risk-badge" style="background: \${t.tradeType === 'Buy' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)'}; color: \${t.tradeType === 'Buy' ? 'var(--success)' : 'var(--danger)'}">\${t.tradeType || "-"}</span></td>
                    <td>\${t.setupType || "-"}</td>
                    <td><span style="color: \${resultColor}; font-weight: 600;">\${t.resultType || "-"}</span></td>
                    <td class="font-mono" style="color: \${t.r >= 0 ? "var(--success)" : "var(--danger)"}">\${t.r > 0 ? "+" : ""}\${(t.r || 0).toFixed(2)}R</td>
                    <td class="font-mono" style="color: \${pnlColor}">\${t.pnlAmount > 0 ? "+" : ""}$\${(t.pnlAmount || 0).toFixed(2)}</td>
                    <td>\${t.qualityScore || "-"}/10</td>
                    <td>
                        <button class="icon-btn" onclick="deleteTrade(\${t.id})" title="Delete Trade">
                            <i data-lucide="trash-2" style="color: var(--danger); width: 16px; height: 16px;"></i>
                        </button>
                    </td>
                </tr>
            \`;
          }
        );
        lucide.createIcons();
      };

      `;

html = html.substring(0, startIdx) + newJS + html.substring(endIdx);
fs.writeFileSync('index.html', html);
