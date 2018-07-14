const request = require('request-promise-native')

const retriever = async (url, progress, token) => {

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

    let getFile = request.get(settings)

    getFile.on('data', (chunk) =>{
        progress(chunk.length)
    })

    return await getFile
}

module.exports = retriever