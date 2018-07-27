const request = require('request-promise-native')

const parsePackageSettings = (url, token) => {
    let settings = { 
        url: url, 
        headers: {
            'User-Agent': 'request',
            Accept: 'application/octet-stream'
        }
    }
    if(token)
        settings.auth = {
            bearer: token,
            sendImmediately: true
        }
    return settings
}

const parseReleaseSettings = (manifest) => {
    let version = manifest.version === 'latest' ? 'latest' : 'tags/' + manifest.version
    let token = manifest.token ? '?access_token='+manifest.token : ''
    let settings = { 
        url: `https://api.github.com/repos/${manifest.user}/${manifest.repo}/releases/${version}${token}`,
        json: true,
        headers: {
            'User-Agent': 'request'
        }
    }
    return settings
}

const getPackage = (url, token) => request.get(parsePackageSettings(url,token))

const getReleaseInfo = (manifest) => request.get(parseReleaseSettings(manifest))

module.exports = { getPackage, getReleaseInfo }