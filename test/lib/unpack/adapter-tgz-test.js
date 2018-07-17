jest.mock('gunzip-maybe', () => jest.fn())
jest.mock('tar-fs', () => ({
    extract: jest.fn()
}))
jest.mock('../../../lib/helpers/file-system', () => ({
    isWindows: jest.fn(),
    fileMapper: jest.fn(),
    _files: []
}))

const unpack = require('../../../lib/unpack/adapter-tgz'),
    fileSystem = require('../../../lib/helpers/file-system'),
    gunzip = require('gunzip-maybe'),
    tar = require('tar-fs'),
    transform = require('stream').Transform,
    faker = require('faker')

describe('unpack binary', () => {

    test('unpack tgz binary windows', async () => {
        let destination = faker.random.uuid(),
        stream = new transform({ objectMode: true })

        stream.push(null)

        gunzip.mockReturnValue(stream)
        tar.extract.mockReturnValue(stream)
        fileSystem.isWindows.mockReturnValue(true)

        let result = await unpack(stream, destination)
        
        expect(gunzip).toBeCalled()
        expect(tar.extract).toBeCalledWith(destination, {  
            umask: false,
            map: fileSystem.fileMapper
         })
         expect(result).toEqual({
             destination: destination,
             files: []
            })
    })

    test('unpack tgz binary other', async () => {
        let destination = faker.random.uuid(),
        stream = new transform({ objectMode: true })

        stream.push(null)

        gunzip.mockReturnValue(stream)
        tar.extract.mockReturnValue(stream)
        fileSystem.isWindows.mockReturnValue(false)

        await unpack(stream, destination)
        
        expect(gunzip).toBeCalledWith()
        expect(tar.extract).toBeCalledWith(destination, {  
            umask: 0,
            map: fileSystem.fileMapper
         })
    })
})