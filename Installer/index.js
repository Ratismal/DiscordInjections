const Install = require('./install');
const Uninstall = require('./uninstall');

function exit(code = 0) {
    if (!(typeof code == 'number')) code = 0;
    console.log(`Exiting with code ${code}`);
    process.exit(code);
}

function err(err) {
    console.error(`An error has occurred: ${err.message}`);
    exit(1);
}

module.exports = {
    install(proc) {
        console.log('Installing');
        Install(proc).then(exit).catch(err);
    },
    uninstall(proc) {
        console.log('Uninstalling');
        Uninstall(proc).then(exit).catch(err);
    },
    reinstall(proc) {
        console.log('Reinstalling');
        Uninstall(proc).then(() => Install(proc)).then(exit).catch(err);
    },
    util: require('./util')
};