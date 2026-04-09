const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// We only want to fix the ones in the script block that got messed up.
// Looking at the grep output, they are between line 6900 and 7100.
// Actually, let's just replace all `\` followed by `\`` or `\$` IF they are in the script tag.
// But it's easier to just replace them globally if they are exactly `\` followed by `\`` or `\$` and it's not a valid escape sequence in a string.
// Wait, `\`` is valid in a string, but `\$` is not.
// Let's just do a string replacement for the specific lines.

const lines = html.split('\n');
for (let i = 6900; i < 7100; i++) {
  if (lines[i]) {
    lines[i] = lines[i].replace(/\\\`/g, '`').replace(/\\\$/g, '$');
  }
}

fs.writeFileSync('index.html', lines.join('\n'));
