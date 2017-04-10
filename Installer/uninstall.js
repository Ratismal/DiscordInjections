const path = require('path');
const fs = require('fs');
const asar = require('asar');
const childProcess = require('child_process');
const Installer = require('./util');
var appPath;

function closeClient(proc) {
    console.log('Closing client...');
    for (const pid of proc.pid) {
        process.kill(pid);
    }
    appPath = proc.command;
    return path.join(proc.command, '..', 'resources', 'original_app.asar');
}

var deleteFolderRecursive = function (path) {
    if (fs.existsSync(path) && path != '/') {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

function restoreClient(_path) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(_path)) {
            const folder = path.join(_path, '..', 'app');
            console.log('Deleting the app folder...');
            deleteFolderRecursive(folder);
            console.log('Renaming the asar...');
            fs.renameSync(_path, path.join(_path, '..', 'app.asar'));
        } else console.log('ASAR does not exist, skipping...');
        resolve();
    });
}

function relaunchClient() {
    return new Promise((resolve, reject) => {
        console.log('Relaunching client...');
        let child = childProcess.spawn(appPath, { detached: true });
        child.unref();
        resolve();
    });
}

module.exports = function () {
    return Installer.getDiscordProcess()
        .then(closeClient)
        .then(restoreClient)
        .then(relaunchClient)
        .catch(err => {
            console.error('An error has occurred. ' + err.message);
            return 1;
        });
};