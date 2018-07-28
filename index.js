let path = require('path'),
    toggles = require('./lib/helpers/toggles')


function getPlatformInfo() {
    if (/linux/.test(process.platform)) {
        return 'linux'
    } else if (/darwin/.test(process.platform)) {
        return 'osx'
    } else {
        return 'windows'
    }
}

module.exports.install = toggles.isRefactor()? require('./lib/installer') : require('./lib/install')

module.exports.initialize = function initialize(basedir, manifest){
    var inf = manifest ? manifest : {}
    var targetDir = process.env.PREBUILT_TARGET_DIR || inf.targetDir || './bin'
    var targetBin = process.env.PREBUILT_BINARY || inf.targetBin
    var paths = inf.paths
    var platform = process.env.PREBUILT_PLATFORM || inf.platform || getPlatformInfo()

    if (targetBin)
        module.exports.binary = require(basedir + '/' + targetDir + '/' + targetBin);

    if(paths)
        module.exports.path = path.join(basedir, paths[platform])
}