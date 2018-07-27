const retriever = require('./retriever'),
    unpacker = require('./unpack/unpacker'),
    tracker = require('./helpers/progress-tracker'),
    path = require('path')

const download = async (destination, name, url, token) => {
    var extension = path.extname(name)
    let stream = retriever.getPackage(url, token)
    tracker(stream)
    await unpacker(extension, stream, destination)
 };
module.exports = download