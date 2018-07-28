const path = require('path')

const platforms = ['osx', 'windows', 'linux', 'all']
const architecture = ['ia32', 'x64', 'all']

let getArchitecture = () => process.arch
let getPlatform = () => process.platform

const validate = manifest => {
    if(!platforms.includes(manifest.runtime.platform))
    throw "Unsupported platform"
    if(!architecture.includes(manifest.runtime.arch))
        throw "Unsupported architecture"
    if (!manifest.user)
        throw "User needs to be defined"
    if (!manifest.repo)
        throw "Repository needs to be defined"
}

const mapManifest = manifest => {
    let computerInfo = module.exports._.getInfo()
    let info = manifest ? manifest : {} 
    return {
        runtime: {
            platform: process.env.PREBUILT_PLATFORM || info.platform || computerInfo.split(':')[0],
            arch: process.env.PREBUILT_ARCH || info.arch || computerInfo.split(':')[1]
        },
        user: process.env.PREBUILT_USER || info.user,
        repo: process.env.PREBUILT_REPO || info.repo,
        token: process.env.PREBUILT_TOKEN || info.token,
        version: process.env.PREBUILT_VERSION || info.version || 'latest',
        dir: process.env.PREBUILT_TARGET_DIR || info.targetDir || './bin'
    }
}

const mapReleases = (request, runtime) => {
    return request.assets.reverse().find( asset => {
        let assetParsed = path.parse(asset.name).name
            .replace(/\.[^/.]+$/, "")
            .split('_')
        return runtime.arch = assetParsed.pop() && runtime.platform == assetParsed.pop()
    })
}

const getInfo = () => {
    const architecture = module.exports._.getArchitecture()
    const platform = module.exports._.getPlatform()
    if (/linux/.test(platform)) {
        return architecture == 32 ? 'linux:ia32' : 'linux:x64'
    } else if (/darwin/.test(platform)) {
        return 'osx:' + architecture
    } else {
        return 'windows:' + architecture
    }
}

module.exports = { 
    manifest : { map: mapManifest, validate }, 
    releases : { map : mapReleases },
    _: { getInfo, getArchitecture, getPlatform }
}