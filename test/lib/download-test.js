jest.mock('../../lib/retriever', () => ({ getPackage: jest.fn()}))
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
    { faker } = require('@faker-js/faker')

describe('download', () => {
    test('should retrieve file and unpack', async () => {
        let url = faker.datatype.uuid(), 
            token = faker.datatype.uuid(),
            name = faker.datatype.uuid(),
            destination = faker.datatype.uuid(),
            extname = faker.datatype.uuid(),
            retrieverResult = faker.datatype.uuid()

        retriever.getPackage.mockReturnValue(retrieverResult)
        path.extname.mockReturnValue(extname)

        await download(destination, name, url, token)

        expect(retriever.getPackage).toBeCalledWith(url, token)
        expect(tracker).toBeCalledWith(retrieverResult)
        expect(path.extname).toBeCalledWith(name)
        expect(unpacker).toBeCalledWith(extname, retrieverResult, destination)
    })
})