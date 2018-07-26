jest.mock('../../lib/retriever', () => jest.fn())
jest.mock('../../lib/unpack/unpacker', () => jest.fn())
jest.mock('../../lib/helpers/progress-tracker', () => jest.fn())
jest.mock('path', () => ({
    extname: jest.fn()
}))

const download = require('../../lib/download'),
    retriever = require('../../lib/retriever'),
    unpacker = require('../../lib/unpack/unpacker'),
    tracker = require('../../lib/helpers/progress-tracker'),
    path = require('path'),
    faker = require('faker')

describe('download', () => {
    test('should retrieve file and unpack', async () => {
        let url = faker.random.uuid(), 
            token = faker.random.uuid(),
            name = faker.random.uuid(),
            destination = faker.random.uuid(),
            extname = faker.random.uuid(),
            retrieverResult = faker.random.uuid()

        retriever.mockReturnValue(retrieverResult)
        path.extname.mockReturnValue(extname)

        await download(destination, name, url, token)

        expect(retriever).toBeCalledWith(url, token)
        expect(tracker).toBeCalledWith(retrieverResult)
        expect(path.extname).toBeCalledWith(name)
        expect(unpacker).toBeCalledWith(extname, retrieverResult, destination)
    })
})