const path = require('path'),
    fs = require('fs')

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

const stripRootFolder = (files) => {
    return new Promise((resolve,reject) => {
        let directories = fs.readdirSync(files.destination)
        
        if (directories.length != 1)
            return resolve()
            
        let rootFolder = path.join(files.destination,directories[0])
            
        if(!fs.statSync(rootFolder).isDirectory())
            return resolve()
            
        fs.copy(rootFolder, files.destination, (err) => {
            if (err) 
                reject(err)
            else fs.remove(rootFolder, () => resolve() )
        })
    })
    
}

module.exports = { isWindows , fileMapperTgz ,fileMapperZip, _files, stripRootFolder }