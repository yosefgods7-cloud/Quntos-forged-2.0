const fs = require('fs');
const acorn = require('acorn');
const code = fs.readFileSync('script7.js', 'utf8');
try {
  acorn.parse(code, { ecmaVersion: 2022 });
  console.log('No syntax errors found by acorn.');
} catch (e) {
  console.log('Syntax error:', e.message);
  const lines = code.split('\n');
  const lineNum = e.loc.line;
  console.log('Line ' + lineNum + ':', lines[lineNum - 1]);
  console.log('Context:');
  for(let i = Math.max(0, lineNum - 3); i < Math.min(lines.length, lineNum + 2); i++) {
    console.log((i+1) + ': ' + lines[i]);
  }
}
