const Installer = require('./Installer');
const util = Installer.util;

util.getDiscordProcess().then((proc) => {
    var args = process.argv;
    switch (args[2]) {
        case 'install':
            Installer.install(proc);
            break;
        case 'uninstall':
            Installer.uninstall(proc);
            break;
        case 'reinstall':
            Installer.reinstall(proc);
            break;
        default:
            console.log('invalid');
            break;
    }
});

