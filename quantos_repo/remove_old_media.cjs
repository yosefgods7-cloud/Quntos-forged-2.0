const fs = require('fs');
const path = '/app/applet/quantos_repo/index.html';
let html = fs.readFileSync(path, 'utf8');

const startIdx = html.indexOf('@media (max-width: 768px) {');
if (startIdx !== -1) {
    // Find the matching closing brace
    let braceCount = 0;
    let endIdx = -1;
    for (let i = startIdx; i < html.length; i++) {
        if (html[i] === '{') braceCount++;
        else if (html[i] === '}') {
            braceCount--;
            if (braceCount === 0) {
                endIdx = i;
                break;
            }
        }
    }
    
    if (endIdx !== -1) {
        // Remove the old media query
        html = html.substring(0, startIdx) + html.substring(endIdx + 1);
        fs.writeFileSync(path, html);
        console.log('Removed old media query');
    } else {
        console.log('Could not find end of old media query');
    }
} else {
    console.log('Could not find start of old media query');
}
