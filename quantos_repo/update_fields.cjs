const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Replace t.model with t.setupType
html = html.replace(/t\.model/g, 't.setupType');

// Replace t.grade with t.qualityScore
html = html.replace(/t\.grade/g, 't.qualityScore');

// Replace t.mistake with t.ruleDeviation
html = html.replace(/t\.mistake/g, 't.ruleDeviation');

// Replace tradeModelChart with tradeSetupChart
html = html.replace(/tradeModelChart/g, 'tradeSetupChart');

// Replace tradeModelObj with tradeSetupObj
html = html.replace(/tradeModelObj/g, 'tradeSetupObj');

// Replace tradeGradeChart with tradeQualityChart
html = html.replace(/tradeGradeChart/g, 'tradeQualityChart');

// Replace tradeGradeObj with tradeQualityObj
html = html.replace(/tradeGradeObj/g, 'tradeQualityObj');

fs.writeFileSync('index.html', html);
