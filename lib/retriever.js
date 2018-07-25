const request = require('request-promise-native')

const parseRequestSettings = (url, token) => {
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

const retriever = async (url, token) => await request.get(parseRequestSettings(url,token))

module.exports = retriever