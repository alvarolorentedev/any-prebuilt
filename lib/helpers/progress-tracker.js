const progress = require('progress')

let bar

const bindSetupProgress = request =>
    request.on('response', (res) => {
        let len = parseInt(res.headers['content-length'], 10)
        if(!bar)
            bar = new progress('downloading [:bar] :percent :etas', {
                complete: "=", 
                incomplete: "-", 
                width: 20,
                total: len
            })
        else
            bar.total += len
    })

const bindProgress = request => request.on('data', (chunk) => bar.tick(chunk.length))

const tracker = (request) => {
    bindSetupProgress(request)
    bindProgress(request)
    
}

module.exports = tracker