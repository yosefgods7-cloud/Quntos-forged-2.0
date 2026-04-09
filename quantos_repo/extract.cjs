const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const scripts = html.match(/<script.*?>([\s\S]*?)<\/script>/g);
const code = scripts[7].replace(/<script.*?>|<\/script>/g, '');
fs.writeFileSync('script7.js', code);
