const adapterZip = require('./adapter-zip'),
    adapterTgz = require('./adapter-tgz'),
    fs = require('fs-extra')

const mapper = {
    '.zip' : adapterZip,
    '.gz' : adapterTgz,
    '.tgz' : adapterTgz,
}

module.exports = async (extension, stream, destination) => {
    fs.mkdirsSync(destination)
    return await mapper[extension](stream, destination)
}