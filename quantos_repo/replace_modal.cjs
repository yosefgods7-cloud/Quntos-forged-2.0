const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const startIdx = html.indexOf('<div id="modal-add-trade" class="modal-overlay">');
const endIdx = html.indexOf('<!-- Add Backtest Modal -->');

const newModal = `
<div id="modal-add-trade" class="modal-overlay">
  <div class="modal" style="max-width: 900px; max-height: 90vh; overflow-y: auto">
    <div class="header" style="display: flex; justify-content: space-between; align-items: center;">
      <h2>Log Trade</h2>
      <i data-lucide="x" onclick="closeModal()" style="cursor: pointer"></i>
    </div>

    <!-- 1. TRADE IDENTIFICATION -->
    <h3 style="margin-top: 0; font-size: 1.1rem; border-bottom: 1px solid var(--border); padding-bottom: 8px;">1. Trade Identification</h3>
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 16px;">
      <div class="form-group">
        <label>Pair</label>
        <div class="input-wrapper">
          <i data-lucide="activity"></i>
          <input type="text" id="trade-asset" list="trade-asset-list" placeholder="e.g. EURUSD" />
          <datalist id="trade-asset-list"></datalist>
        </div>
      </div>
      <div class="form-group">
        <label>Date</label>
        <div class="input-wrapper">
          <i data-lucide="calendar"></i>
          <input type="date" id="trade-date" />
        </div>
      </div>
      <div class="form-group">
        <label>Entry Time</label>
        <div class="input-wrapper">
          <i data-lucide="clock"></i>
          <input type="time" id="trade-entry-time" />
        </div>
      </div>
      <div class="form-group">
        <label>Session</label>
        <div class="input-wrapper">
          <i data-lucide="globe"></i>
          <select id="trade-session">
            <option value="Asia">Asia</option>
            <option value="London">London</option>
            <option value="New York">New York</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label>Trade Type</label>
        <div class="input-wrapper">
          <i data-lucide="arrow-up-down"></i>
          <select id="trade-type">
            <option value="Buy">Buy</option>
            <option value="Sell">Sell</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label>Execution Type</label>
        <div class="input-wrapper">
          <i data-lucide="zap"></i>
          <select id="trade-execution">
            <option value="Market">Market</option>
            <option value="Limit">Limit</option>
            <option value="Stop">Stop</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label>Account</label>
        <div class="input-wrapper">
          <i data-lucide="wallet"></i>
          <select id="trade-account">
            <option value="all">Unassigned</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 2. RISK & POSITION DATA -->
    <h3 style="margin-top: 24px; font-size: 1.1rem; border-bottom: 1px solid var(--border); padding-bottom: 8px;">2. Risk & Position Data</h3>
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 16px;">
      <div class="form-group">
        <label>Lot Size</label>
        <div class="input-wrapper">
          <i data-lucide="layers"></i>
          <input type="number" id="trade-lot-size" step="0.01" placeholder="0.00" />
        </div>
      </div>
      <div class="form-group">
        <label>Entry Price</label>
        <div class="input-wrapper">
          <i data-lucide="dollar-sign"></i>
          <input type="number" id="trade-entry-price" step="0.00001" placeholder="0.00000" oninput="calculateRR()" />
        </div>
      </div>
      <div class="form-group">
        <label>Stop Loss (Price)</label>
        <div class="input-wrapper">
          <i data-lucide="shield-alert"></i>
          <input type="number" id="trade-sl-price" step="0.00001" placeholder="0.00000" oninput="calculateRR()" />
        </div>
      </div>
      <div class="form-group">
        <label>Stop Loss (Pips)</label>
        <div class="input-wrapper">
          <i data-lucide="ruler"></i>
          <input type="number" id="trade-sl-pips" step="0.1" placeholder="0.0" />
        </div>
      </div>
      <div class="form-group">
        <label>Take Profit (Price)</label>
        <div class="input-wrapper">
          <i data-lucide="target"></i>
          <input type="number" id="trade-tp-price" step="0.00001" placeholder="0.00000" oninput="calculateRR()" />
        </div>
      </div>
      <div class="form-group">
        <label>Take Profit (Pips)</label>
        <div class="input-wrapper">
          <i data-lucide="ruler"></i>
          <input type="number" id="trade-tp-pips" step="0.1" placeholder="0.0" />
        </div>
      </div>
      <div class="form-group">
        <label>Risk Amount ($)</label>
        <div class="input-wrapper">
          <i data-lucide="dollar-sign"></i>
          <input type="number" id="trade-risk-amount" step="0.01" placeholder="0.00" />
        </div>
      </div>
      <div class="form-group">
        <label>Risk Amount (%)</label>
        <div class="input-wrapper">
          <i data-lucide="percent"></i>
          <input type="number" id="trade-risk-percent" step="0.01" placeholder="0.00" />
        </div>
      </div>
      <div class="form-group">
        <label>Account Balance (Entry)</label>
        <div class="input-wrapper">
          <i data-lucide="wallet"></i>
          <input type="number" id="trade-account-balance" step="0.01" placeholder="0.00" />
        </div>
      </div>
      <div class="form-group">
        <label>Planned R:R</label>
        <div class="input-wrapper">
          <i data-lucide="bar-chart-2"></i>
          <input type="number" id="trade-planned-r" step="0.1" placeholder="Auto" readonly style="background: var(--bg); cursor: not-allowed;" />
        </div>
      </div>
    </div>

    <!-- 3. TRADE OUTCOME -->
    <h3 style="margin-top: 24px; font-size: 1.1rem; border-bottom: 1px solid var(--border); padding-bottom: 8px;">3. Trade Outcome</h3>
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 16px;">
      <div class="form-group">
        <label>Result Type</label>
        <div class="input-wrapper">
          <i data-lucide="check-circle"></i>
          <select id="trade-result-type" onchange="toggleOutcomeFields()">
            <option value="Win">Win</option>
            <option value="Loss">Loss</option>
            <option value="Break Even">Break Even</option>
            <option value="Partial Win">Partial Win</option>
            <option value="Canceled">Canceled</option>
            <option value="Missed">Missed</option>
          </select>
        </div>
      </div>
      <div class="form-group outcome-field">
        <label>Exit Time</label>
        <div class="input-wrapper">
          <i data-lucide="clock"></i>
          <input type="time" id="trade-exit-time" />
        </div>
      </div>
      <div class="form-group outcome-field">
        <label>Actual R Multiple</label>
        <div class="input-wrapper">
          <i data-lucide="trending-up"></i>
          <input type="number" id="trade-r" step="0.1" placeholder="e.g. 2.5 or -1" />
        </div>
      </div>
      <div class="form-group outcome-field">
        <label>Profit/Loss ($)</label>
        <div class="input-wrapper">
          <i data-lucide="dollar-sign"></i>
          <input type="number" id="trade-pnl-amount" step="0.01" placeholder="0.00" />
        </div>
      </div>
      <div class="form-group outcome-field">
        <label>Profit/Loss (%)</label>
        <div class="input-wrapper">
          <i data-lucide="percent"></i>
          <input type="number" id="trade-pnl-percent" step="0.01" placeholder="0.00" />
        </div>
      </div>
      <div class="form-group missed-field" style="display: none;">
        <label>Reason for Missed</label>
        <div class="input-wrapper">
          <i data-lucide="help-circle"></i>
          <select id="trade-missed-reason">
            <option value="Hesitation">Hesitation</option>
            <option value="No confirmation">No confirmation</option>
            <option value="Late entry">Late entry</option>
            <option value="Distraction">Distraction</option>
          </select>
        </div>
      </div>
      <div class="form-group canceled-field" style="display: none;">
        <label>Reason for Canceled</label>
        <div class="input-wrapper">
          <i data-lucide="x-circle"></i>
          <select id="trade-canceled-reason">
            <option value="Setup invalidated">Setup invalidated</option>
            <option value="News">News</option>
            <option value="Risk management">Risk management</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 4. MARKET CONTEXT -->
    <h3 style="margin-top: 24px; font-size: 1.1rem; border-bottom: 1px solid var(--border); padding-bottom: 8px;">4. Market Context</h3>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 16px;">
      <div class="form-group">
        <label>HTF Bias</label>
        <div class="input-wrapper">
          <i data-lucide="trending-up"></i>
          <select id="trade-htf-bias">
            <option value="Bullish">Bullish</option>
            <option value="Bearish">Bearish</option>
            <option value="Neutral">Neutral</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label>Entry Timeframe</label>
        <div class="input-wrapper">
          <i data-lucide="clock"></i>
          <select id="trade-entry-tf">
            <option value="1m">1m</option>
            <option value="3m">3m</option>
            <option value="5m">5m</option>
            <option value="15m">15m</option>
            <option value="1H">1H</option>
            <option value="4H">4H</option>
            <option value="D">Daily</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label>Setup Type</label>
        <div class="input-wrapper">
          <i data-lucide="crosshair"></i>
          <select id="trade-setup-type">
            <option value="OB">OB (Order Block)</option>
            <option value="FVG">FVG (Fair Value Gap)</option>
            <option value="MSS">MSS (Market Structure Shift)</option>
            <option value="Liquidity Sweep">Liquidity Sweep</option>
            <option value="AMD">AMD (Accumulation, Manipulation, Distribution)</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
    </div>
    <div class="form-group" style="margin-bottom: 16px;">
      <label>Confluence Checklist</label>
      <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-top: 8px;">
        <label style="display: flex; align-items: center; gap: 4px; font-weight: normal;"><input type="checkbox" class="trade-confluence" value="HTF zone"> HTF zone</label>
        <label style="display: flex; align-items: center; gap: 4px; font-weight: normal;"><input type="checkbox" class="trade-confluence" value="Liquidity taken"> Liquidity taken</label>
        <label style="display: flex; align-items: center; gap: 4px; font-weight: normal;"><input type="checkbox" class="trade-confluence" value="MSS confirmed"> MSS confirmed</label>
        <label style="display: flex; align-items: center; gap: 4px; font-weight: normal;"><input type="checkbox" class="trade-confluence" value="FVG present"> FVG present</label>
        <label style="display: flex; align-items: center; gap: 4px; font-weight: normal;"><input type="checkbox" class="trade-confluence" value="Session timing"> Session timing</label>
        <label style="display: flex; align-items: center; gap: 4px; font-weight: normal;"><input type="checkbox" class="trade-confluence" value="Volume confirmation"> Volume confirmation</label>
      </div>
    </div>

    <!-- 5. EXECUTION QUALITY -->
    <h3 style="margin-top: 24px; font-size: 1.1rem; border-bottom: 1px solid var(--border); padding-bottom: 8px;">5. Execution Quality</h3>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 16px;">
      <div class="form-group">
        <label>Trade Quality Score (1-10)</label>
        <div class="input-wrapper">
          <i data-lucide="award"></i>
          <input type="number" id="trade-quality-score" min="1" max="10" value="10" />
        </div>
      </div>
      <div class="form-group">
        <label>Rule Adherence</label>
        <div class="input-wrapper">
          <i data-lucide="check-square"></i>
          <select id="trade-rule-adherence" onchange="toggleRuleExplanation()">
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>
      <div class="form-group rule-explanation-field" style="display: none;">
        <label>Rule Deviation Explanation</label>
        <input type="text" id="trade-rule-deviation" placeholder="Why did you break rules?" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--border); background: var(--bg); color: var(--text);" />
      </div>
    </div>

    <!-- 6. EMOTIONAL & PSYCHOLOGICAL DATA -->
    <h3 style="margin-top: 24px; font-size: 1.1rem; border-bottom: 1px solid var(--border); padding-bottom: 8px;">6. Emotional & Psychological Data</h3>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
      <div class="form-group">
        <label>Pre-Trade State</label>
        <div class="input-wrapper">
          <i data-lucide="smile"></i>
          <select id="trade-pre-emotion">
            <option value="Calm">Calm</option>
            <option value="Confident">Confident</option>
            <option value="Fear">Fear</option>
            <option value="Greed">Greed</option>
            <option value="Hesitation">Hesitation</option>
            <option value="Overconfidence">Overconfidence</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label>During Trade State</label>
        <div class="input-wrapper">
          <i data-lucide="activity"></i>
          <select id="trade-during-emotion">
            <option value="Disciplined">Disciplined</option>
            <option value="Emotional">Emotional</option>
            <option value="Impulsive">Impulsive</option>
            <option value="Patient">Patient</option>
          </select>
        </div>
      </div>
    </div>
    <div class="form-group" style="margin-bottom: 16px;">
      <label>Post-Trade Reflection (Required)</label>
      <textarea id="trade-post-notes" rows="3" placeholder="How did it play out? What did you learn?" style="width: 100%; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 12px; color: var(--text); font-family: var(--font-sans);"></textarea>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
      <div class="form-group">
        <label>Tags (comma separated)</label>
        <div class="input-wrapper">
          <i data-lucide="tag"></i>
          <input type="text" id="trade-tags" placeholder="e.g. trend-following, news" />
        </div>
      </div>
      <div class="form-group">
        <label>Screenshot URL</label>
        <div class="input-wrapper">
          <i data-lucide="image"></i>
          <input type="text" id="trade-screenshot" placeholder="https://..." />
        </div>
      </div>
    </div>

    <button style="width: 100%; margin-top: 24px" onclick="saveTrade()">
      Log Trade
    </button>
  </div>
</div>
    `;

html = html.substring(0, startIdx) + newModal + html.substring(endIdx);
fs.writeFileSync('index.html', html);
