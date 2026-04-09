const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const scripts = html.match(/<script.*?>([\s\S]*?)<\/script>/g);
if (scripts) {
  scripts.forEach((s, i) => {
    const code = s.replace(/<script.*?>|<\/script>/g, '');
    try {
      new Function(code);
    } catch(e) {
      console.log('Script ' + i + ' error:', e.message);
      console.log(code.split('\n').slice(0, 5).join('\n'));
    }
  });
}
