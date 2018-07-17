const gunzip = require('gunzip-maybe'),
    tar = require('tar-fs'),
    fileSystem = require('../helpers/file-system')

const unpack = (stream, destination) => {
    return new Promise((resolve, reject) => {
        stream
        .pipe(gunzip())
        .on('error', (error) => {
            reject(error)
        })
        .pipe(tar.extract(destination, {  
            umask: fileSystem.isWindows() ? false : 0,
            map: fileSystem.fileMapper
         }))
         .on('finish', () => {
            resolve({
                files: fileSystem._files,
                destination: destination
            })
         })
    })

 }

module.exports = unpack