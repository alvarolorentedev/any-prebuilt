const fileSystem = require('../helpers/file-system'),
    decompress = require('decompress-zip'),
    temp = require('temp'),
    fs = require('fs'),
    path = require('path')

const bindSuccess = (eventEmitter, destination, cb) => {
    eventEmitter.on('extract', () => {
        fileSystem._files.forEach((file) => {
            fs.chmodSync(path.join(destination, file.path), file.mode)
        });
        cb({ 
            destination: destination,
            files: fileSystem._files
        })
    
    })
}

const bindError = (eventEmitter, cb) => eventEmitter.on('error', (error) => cb(error))
    
const unpack = (stream, destination) => {
    return new Promise((resolve, reject) => {
        temp.track()
        stream
            .pipe(temp.createWriteStream('temp.zip'))
            .on('finish', () => {
                let zipFile = new decompress('temp.zip')
                bindSuccess(zipFile, destination, resolve)
                bindError(zipFile, reject)
                zipFile.extract({ 
                    path: destination, 
                    filter: fileSystem.fileMapperZip 
                })
            })
    })
 }

module.exports = unpack