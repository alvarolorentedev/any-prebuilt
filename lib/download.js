const retriever = require('./retriever'),
    unpacker = require('./unpack/unpacker'),
    path = require('path')

const download = async (destination, name, url, progressTracker, token) => {
    var extension = path.extname(name)
    let stream = await retriever(url, progressTracker, token)
    await unpacker(destination, stream, extension)
 };
module.exports = download