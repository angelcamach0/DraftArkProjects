'use strict';
const fs = require('fs');
const path = require('path');

module.exports = function renderAssets() {
    const sourcePath = path.resolve(path.dirname(__filename), '../src/assets');
    const destPath = path.resolve(path.dirname(__filename), '../dist/assets');
    
    fs.cpSync(sourcePath, destPath, { recursive: true });
};
