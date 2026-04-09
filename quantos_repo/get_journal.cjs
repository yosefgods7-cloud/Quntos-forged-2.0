const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const startIdx = html.indexOf('<div id="trade-journal" class="view">');
const endIdx = html.indexOf('<!-- Settings View -->');
console.log(html.substring(startIdx, endIdx));
