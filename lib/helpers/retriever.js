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

const bindProgress = (request, progress) => {
    request.on('data', (chunk) =>{
        progress(chunk.length)
    })
}

const retriever = async (url, progress, token) => {
    let rq = request.get(parseRequestSettings(url,token))
    bindProgress(rq,progress)
    return await rq
}

module.exports = retriever