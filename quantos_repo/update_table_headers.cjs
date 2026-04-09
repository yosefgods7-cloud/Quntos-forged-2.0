const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const startIdx = html.indexOf('<tr>\n                  <th>Date</th>');
const endIdx = html.indexOf('</tr>\n              </thead>\n              <tbody id="trades-table-body">');

const newHeaders = `<tr>
                  <th>Date</th>
                  <th>Asset</th>
                  <th>Session</th>
                  <th>Type</th>
                  <th>Setup</th>
                  <th>Result</th>
                  <th>R:R</th>
                  <th>PnL</th>
                  <th>Quality</th>
                  <th>Actions</th>
                `;

html = html.substring(0, startIdx) + newHeaders + html.substring(endIdx);
fs.writeFileSync('index.html', html);
