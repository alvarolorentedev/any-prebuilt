const platforms = ['osx', 'windows', 'linux', 'all']
const architecture = ['ia32', 'x64', 'all']

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

const map = manifest => {
    let info = manifest ? manifest : {} 
    return {
        runtime: {
            platform: process.env.PREBUILT_PLATFORM || info.platform,
            arch: process.env.PREBUILT_ARCH || info.arch
        },
        user: process.env.PREBUILT_USER || info.user,
        repo: process.env.PREBUILT_REPO || info.repo,
        token: process.env.PREBUILT_TOKEN || info.token,
        version: process.env.PREBUILT_VERSION || info.version || 'latest',
        targetDir: process.env.PREBUILT_TARGET_DIR || info.targetDir || './bin'
    }
}

const getInfo = () => {}
 
module.exports = {map, validate, getInfo}