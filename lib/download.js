const retriever = require('./retriever'),
    unpacker = require('./unpack/unpacker'),
    tracker = require('./helpers/progress-tracker'),
    path = require('path')

const download = async (destination, name, url, token) => {
    var extension = path.extname(name)
    let stream = retriever(url, token)
    tracker(stream)
    await stream
    await unpacker(destination, stream, extension)
 };
module.exports = download