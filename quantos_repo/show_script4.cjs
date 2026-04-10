const fs = require('fs');
const html = fs.readFileSync('/app/applet/quantos_repo/index.html', 'utf8');
const scriptMatches = html.match(/<script.*?>([\s\S]*?)<\/script>/gi);
if (scriptMatches && scriptMatches[4]) {
    console.log(scriptMatches[4].substring(0, 500));
}
