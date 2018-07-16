const path = require('path')

const isWindows = () => /^win/.test(process.platform)

const _files = []

const fileMapper = (header) => {
    _files.push({
        path: path.basename(header.name)
    })
    return header
}

module.exports = { isWindows , fileMapper , _files }