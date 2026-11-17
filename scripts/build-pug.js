'use strict';
const fs = require('node:fs');
const path = require('node:path');
const renderPug = require('./render-pug');

const srcPath = path.resolve(__dirname, '../src/pug');
for (const file of fs.readdirSync(srcPath, { recursive: true })) {
    const normalized = file.replaceAll('\\', '/');
    if (normalized.endsWith('.pug') && !/(^|\/)(includes?|mixins?|layouts)\//.test(normalized)) {
        renderPug(path.join(srcPath, file));
    }
}
