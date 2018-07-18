const path = require('path')

const isWindows = () => /^win/.test(process.platform)

const _files = []

const fileMapperTgz = (header) => {
    _files.push({
        path: path.basename(header.name)
    })
    return header
}

const fileMapperZip = (entry) => {
    _files.push({
        path: entry.path,
        mode: entry.mode.toString(8)
    })
    return true
}

module.exports = { isWindows , fileMapperTgz ,fileMapperZip, _files }