'use strict';
const fs = require('fs');
const path = require('path');
const pug = require('pug');
const prettier = require('prettier');

module.exports = function renderPug(filePath) {
    const pugRoot = path.resolve(__dirname, '../src/pug');
    const destPath = path.resolve(__dirname, '../dist', path.relative(pugRoot, filePath)).replace(/\.pug$/, '.html');
    const srcPath = path.resolve(path.dirname(__filename), '../src');

    console.log(`### INFO: Rendering ${filePath} to ${destPath}`);
    const html = pug.renderFile(filePath, {
        doctype: 'html',
        filename: filePath,
        basedir: srcPath
    });

    const destPathDirname = path.dirname(destPath);
    fs.mkdirSync(destPathDirname, { recursive: true });

    const prettified = prettier.format(html, {
        printWidth: 1000,
        tabWidth: 4,
        singleQuote: true,
        proseWrap: 'preserve',
        endOfLine: 'lf',
        parser: 'html',
        htmlWhitespaceSensitivity: 'ignore'
    });

    fs.writeFileSync(destPath, prettified);
};
