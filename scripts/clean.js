'use strict';
const fs = require('node:fs');
const path = require('node:path');

// This legacy repository also maintains assets directly in dist/assets.
// Clean generated code only; never delete those hand-maintained assets.
const destPath = path.resolve(__dirname, '../dist');
fs.mkdirSync(destPath, { recursive: true });
for (const entry of ['index.html', 'css', 'js']) {
    fs.rmSync(path.join(destPath, entry), { recursive: true, force: true });
}

