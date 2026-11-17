const concurrently = require('concurrently');
concurrently([
    { command: 'node scripts/sb-watch.js', name: 'SB_WATCH', prefixColor: 'bgBlue.bold' },
    {
        command: 'browser-sync start --server dist --watch --reload-delay 2000 --reload-debounce 2000 --listen 127.0.0.1 --no-online --no-open --no-ui',
        name: 'SB_BROWSER_SYNC',
        prefixColor: 'bgGreen.bold',
    }
], {
    prefix: 'name',
    killOthers: ['failure', 'success'],
}).result.then(success, failure);

function success() {
    console.log('Success');
}

function failure() {
    console.log('Failure');
    process.exitCode = 1;
}
