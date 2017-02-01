var findProjectRoot = require('find-project-root'),
    path = require('path')

function getPlatformInfo() {
    if (/linux/.test(process.platform)) {
        return 'linux'
    } else if (/darwin/.test(process.platform)) {
        return 'osx'
    } else {
        return 'windows'
    }
}

try {
    var rootdir = findProjectRoot(process.cwd(), { maxDepth: 12 })
    var manifest = require(path.join(rootdir, 'package.json'))
    var inf = (manifest && manifest['prebuilt']) ? manifest['prebuilt'] : {}
    var targetDir = process.env.PREBUILT_TARGET_DIR || inf.targetDir || './bin'
    var targetBin = process.env.PREBUILT_BINARY || inf.targetBin
    var paths = inf.paths
    var platform = process.env.PREBUILT_PLATFORM || inf.platform || getPlatformInfo()
} catch (e) {console.log(e)}

if (targetBin)
    module.exports.binary = require(targetDir + '/' + targetBin);

if(paths)
    module.exports.path = path.join(__dirname, paths[platform])