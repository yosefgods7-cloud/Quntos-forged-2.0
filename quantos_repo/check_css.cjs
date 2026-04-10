const fs = require('fs');
const html = fs.readFileSync('/app/applet/quantos_repo/index.html', 'utf8');
const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/i);
if (styleMatch) {
    const css = styleMatch[1];
    let braceCount = 0;
    for (let i = 0; i < css.length; i++) {
        if (css[i] === '{') braceCount++;
        if (css[i] === '}') braceCount--;
    }
    console.log('Brace count:', braceCount);
} else {
    console.log('No style tag found');
}
