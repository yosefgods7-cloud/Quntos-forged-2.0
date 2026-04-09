const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const startIdx = html.indexOf('<div class="card col-2">');
const endIdx = html.indexOf('<div class="grid" style="margin-top: 24px">');

const newStats = `
          <div class="card col-2">
            <div class="stat-label">Win Rate</div>
            <div class="stat-value" id="tj-win-rate">0%</div>
          </div>
          <div class="card col-2">
            <div class="stat-label">Average R</div>
            <div class="stat-value" id="tj-avg-r">0.00R</div>
          </div>
          <div class="card col-2">
            <div class="stat-label">Total Return %</div>
            <div class="stat-value" id="tj-total-return">0.00%</div>
          </div>
          <div class="card col-2">
            <div class="stat-label">Most Profitable Setup</div>
            <div class="stat-value" id="tj-best-setup" style="font-size: 1.1rem;">-</div>
          </div>
          <div class="card col-2">
            <div class="stat-label">Most Common Mistake</div>
            <div class="stat-value" id="tj-common-mistake" style="font-size: 1.1rem; color: var(--danger)">-</div>
          </div>
          <div class="card col-2">
            <div class="stat-label">Total R-Multiple</div>
            <div class="stat-value" id="tj-total-r">0.00R</div>
          </div>
        </div>
`;

html = html.substring(0, startIdx) + newStats + html.substring(endIdx);
fs.writeFileSync('index.html', html);
