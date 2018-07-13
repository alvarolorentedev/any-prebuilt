const request = require('request')

const retriever = (url, token) => {
    let settings = { 
        url: url, 
        method: 'GET',
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
    request(settings)
}

module.exports = retriever