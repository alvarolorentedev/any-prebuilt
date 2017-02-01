try {
    var rootdir = findProjectRoot(process.cwd(), { maxDepth: 12 })
    var manifest = require(path.join(rootdir, 'package.json'))
    var inf = (manifest && manifest['prebuilt']) ? manifest['prebuilt'] : {}
    var targetDir = process.env.PREBUILT_TARGET_DIR || inf.targetDir || './bin'
    var targetBin = process.env.PREBUILT_BINARY || inf.targetBin
    var paths = inf.paths
} catch (e) {}

if (targetBin)
    module.exports = require(targetDir + '/' + targetBin);

if(paths)
    module.exports.paths = paths