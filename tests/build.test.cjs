const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { Script } = require('node:vm');

test('clean build regenerates the site and preserves manually maintained assets', () => {
    const root = path.resolve(__dirname, '..');
    const assets = path.join(root, 'dist/assets');
    const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
    const retained = new Map();
    if (fs.existsSync(assets)) {
        for (const relative of fs.readdirSync(assets, { recursive: true })) {
            const output = path.join(assets, relative);
            if (fs.statSync(output).isFile() && !fs.existsSync(path.join(root, 'src/assets', relative))) {
                retained.set(output, hash(output));
            }
        }
    }
    assert.ok(process.env.npm_execpath, 'Run with npm run test:build');
    execFileSync(process.execPath, [process.env.npm_execpath, 'run', 'build'], {
        cwd: root, windowsHide: true, stdio: 'pipe', timeout: 60000
    });
    const html = fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8');
    assert.match(html, /id="mainNav"/);
    assert.match(html, /id="portfolioModal1"/);
    assert.match(html, /The Ark Projects 2020/);
    assert.match(html, /bootstrap@4\.6\.2\/dist\/js\/bootstrap\.bundle\.min\.js/);
    assert.doesNotMatch(html, /Your Website 2020/);
    assert.ok(fs.statSync(path.join(root, 'dist/css/styles.css')).size > 1000);
    new Script(fs.readFileSync(path.join(root, 'dist/js/scripts.js'), 'utf8'));
    for (const [file, digest] of retained) assert.equal(hash(file), digest, file);
});
