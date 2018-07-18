const adapterZip = require('./adapter-zip')
const adapterTgz = require('./adapter-tgz')

const mapper = {
    '.zip' : adapterZip,
    '.gz' : adapterTgz,
    '.tgz' : adapterTgz,
}

module.exports = async (extension, stream, destination) => await mapper[extension](stream, destination)