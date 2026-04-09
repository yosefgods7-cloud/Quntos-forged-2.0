const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/perf-table-model/g, 'perf-table-setup');
html = html.replace(/renderPerfTable\("model", "perf-table-setup"\)/g, 'renderPerfTable("setupType", "perf-table-setup")');
html = html.replace(/<h2>Model Breakdown \(Total R\)<\/h2>/g, '<h2>Setup Breakdown (Total R)</h2>');
html = html.replace(/<h2>Setup Grade Distribution<\/h2>/g, '<h2>Trade Quality Distribution</h2>');

fs.writeFileSync('index.html', html);
