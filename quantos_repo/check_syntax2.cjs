const fs = require('fs');
const html = fs.readFileSync('/app/applet/quantos_repo/index.html', 'utf8');
const scriptMatches = html.match(/<script.*?>([\s\S]*?)<\/script>/gi);
if (scriptMatches) {
    scriptMatches.forEach((script, i) => {
        const content = script.replace(/<script.*?>|<\/script>/gi, '');
        if (content.trim() && !script.includes('type="importmap"') && !script.includes('type="module"')) {
            try {
                new Function(content);
            } catch (e) {
                console.error(`Syntax error in script ${i}:`, e.message);
                console.log(content.substring(0, 200));
            }
        }
    });
}
