jest.mock('gunzip-maybe', () => jest.fn())
jest.mock('tar-fs', () => ({
    extract: jest.fn()
}))
jest.mock('../../../lib/helpers/file-system', () => ({
    isWindows: jest.fn(),
    fileMapperTgz: jest.fn(),
    _files: []
}))

const unpack = require('../../../lib/unpack/adapter-tgz'),
    fileSystem = require('../../../lib/helpers/file-system'),
    gunzip = require('gunzip-maybe'),
    tar = require('tar-fs'),
    transform = require('stream').Transform,
    { faker } = require('@faker-js/faker')

describe('unpack binary tgz', () => {

    test('unpack binary windows', async () => {
        let destination = faker.datatype.uuid(),
        stream = new transform({ objectMode: true })

        stream.push(null)

        gunzip.mockReturnValue(stream)
        tar.extract.mockReturnValue(stream)
        fileSystem.isWindows.mockReturnValue(true)

        let result = await unpack(stream, destination)
        
        expect(gunzip).toBeCalled()
        expect(tar.extract).toBeCalledWith(destination, {  
            umask: false,
            map: fileSystem.fileMapperTgz
         })
         expect(result).toEqual({
             destination: destination,
             files: []
        })
    })

    test('unpack binary other', async () => {
        let destination = faker.datatype.uuid(),
        stream = new transform({ objectMode: true })

        stream.push(null)

        gunzip.mockReturnValue(stream)
        tar.extract.mockReturnValue(stream)
        fileSystem.isWindows.mockReturnValue(false)

        await unpack(stream, destination)
        
        expect(gunzip).toBeCalledWith()
        expect(tar.extract).toBeCalledWith(destination, {  
            umask: 0,
            map: fileSystem.fileMapperTgz
         })
    })
})