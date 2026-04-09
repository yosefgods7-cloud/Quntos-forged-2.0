const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const startIdx = html.indexOf('<div id="modal-add-trade" class="modal-overlay">');
const endIdx = html.indexOf('<!-- Add Backtest Modal -->');
console.log(html.substring(startIdx, endIdx));
