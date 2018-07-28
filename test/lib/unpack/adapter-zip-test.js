const EventEmitter = require('events')

class TestEmitter extends EventEmitter {}

jest.mock('../../../lib/helpers/file-system', () => ({
    isWindows: jest.fn(),
    fileMapperZip: jest.fn(),
    _files: [{path: 'pepe', mode: 1}, {path: 'pepa', mode: 2}]
}))

jest.mock('path', () => ({
    join: (first, second) => {return `${first}/${second}`}
}))
jest.mock('decompress-zip', () => {
    let constructorMock = jest.fn()
    return jest.fn(() => constructorMock)
})

jest.mock('temp', () => ({
    track: jest.fn(),
    createWriteStream: jest.fn()
}))

jest.mock('fs-extra', () => ({
    chmodSync: jest.fn()
}))

const unpack = require('../../../lib/unpack/adapter-zip'),
    fileSystem = require('../../../lib/helpers/file-system'),
    transform = require('stream').Transform,
    temp = require('temp'),
    decompress = require('decompress-zip'),
    fs = require('fs-extra'),
    path = require('path'),
    faker = require('faker')

describe('unpack binary zip', () => {
    let extractMock = jest.fn()
    let eventEmitter = new TestEmitter()

    beforeEach(() => {
        extractMock.mockClear()
        decompress.mockImplementation(() =>{
            eventEmitter.extract = extractMock
            return eventEmitter
        })
    })

    test('unpack binary windows on success', async () => {
        let destination = faker.random.uuid(),
        stream = new transform({ objectMode: true })

        temp.createWriteStream.mockReturnValue(stream)
        
        stream.push(null)

        setTimeout(function(){decompress().emit('extract')},100)

        let result = await unpack(stream, destination)
        
        expect(temp.track).toBeCalled()
        expect(temp.createWriteStream).toBeCalledWith()
        expect(extractMock).toBeCalledWith({ path: destination, filter: fileSystem.fileMapperZip })
        fileSystem._files.forEach((file) => {
            expect(fs.chmodSync).toBeCalledWith(`${destination}/${file.path}`, file.mode)
        })
         expect(result).toEqual({
             destination: destination,
             files: fileSystem._files
        })

    })

    test('unpack binary windows on error', async () => {
        let destination = faker.random.uuid(),
            stream = new transform({ objectMode: true }),
            expectedError = faker.random.uuid()

        temp.createWriteStream.mockReturnValue(stream)
        
        stream.push(null)

        setTimeout(function(){decompress().emit('error', expectedError)},100)

        await expect(unpack(stream, destination)).rejects.toEqual(expectedError)

    })
})
