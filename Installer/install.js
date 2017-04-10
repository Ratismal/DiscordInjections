const path = require('path');
const fs = require('fs');
const asar = require('asar');
const childProcess = require('child_process');
const Installer = require('./util');
var appPath;

const preloadPath = path.join(__dirname, '..', 'Preload', 'index.js').replace(/\\/g, '/');
const domPath = path.join(__dirname, '..', 'DomReady', 'inject.js').replace(/\\/g, '/');

function closeClient(proc) {
    console.log('Closing client...');
    for (const pid of proc.pid) {
        process.kill(pid);
    }
    appPath = proc.command;
    return path.join(proc.command, '..', 'resources', 'app.asar');
}

function extractClient(_path) {
    return new Promise((resolve, reject) => {
        const folder = path.join(_path, '..', 'app');
        if (fs.existsSync(_path)) {
            console.log('Extracting the ASAR...');
            asar.extractAll(_path, folder);
            console.log('Renaming the original ASAR...');
            fs.renameSync(_path, path.join(_path, '..', 'original_app.asar'));
        } else console.log('ASAR already extracted, skipping...');
        resolve(path.join(folder, 'index.js'));
    });
}

function injectClient(_path) {
    return new Promise((resolve, reject) => {
        console.log('Injecting scripts...');
        const file = fs.readFileSync(_path, { encoding: 'utf8' });
        let raw = file.split('\n');
        console.log('  ...injecting preloader...');
        const preloadIndex = raw.indexOf('      webPreferences: {');
        raw.splice(preloadIndex + 1, 0, [`        preload: "${preloadPath}",`]);
        console.log('  ...injecting DOM...');
        const domIndex = raw.indexOf(`    mainWindow.webContents.on('dom-ready', function () {});`);
        raw.splice(domIndex, 1, ...[
            `    mainWindow.webContents.on('dom-ready', function () {`,
            `      mainWindow.webContents.executeJavaScript(`,
            `        'window._injectDir = "${path.join(__dirname, '..').replace(/\\/g, '/')}";' + `,
            `        _fs2.default.readFileSync('${domPath}', 'utf8')`,
            `      );`,
            `    });`
        ]);
        console.log('Writing file...');
        fs.writeFileSync(_path, raw.join('\n'));
        resolve();
    });
}

function relaunchClient() {
    return new Promise((resolve, reject) => {
        console.log('Relaunching client');
        let child = childProcess.spawn(appPath, { detached: true });
        child.unref();
        resolve();
    });
}

module.exports = function () {
    return Installer.getDiscordProcess()
        .then(closeClient)
        .then(extractClient)
        .then(injectClient)
        .then(relaunchClient)
        .catch(err => {
            console.error('An error has occurred. ' + err.message);
            return 1;
        });
};