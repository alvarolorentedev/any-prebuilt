jest.mock('../../../lib/unpack/adapter-tgz', () => jest.fn(() => "unpacked tgz"))
jest.mock('../../../lib/unpack/adapter-zip', () => jest.fn(() => "unpacked zip"))

const unpacker = require('../../../lib/unpack/unpacker'),
    adapterTgz = require('../../../lib/unpack/adapter-tgz'),
    adapterZip = require('../../../lib/unpack/adapter-zip'),
    faker = require('faker')

describe('unpacker should', () => {

    test('call adapter zip if .zip extension', async () => {
        let extension = '.zip',
            stream = faker.random.uuid(),
            destination = faker.random.uuid()
        await expect(unpacker(extension, stream, destination)).resolves.toEqual("unpacked zip")
        expect(adapterZip).toBeCalledWith(stream, destination)
    })

    test('call adapter tgz if .gz extension', async () => {
        let extension = '.gz',
            stream = faker.random.uuid(),
            destination = faker.random.uuid()
            await expect(unpacker(extension, stream, destination)).resolves.toEqual("unpacked tgz")
        expect(adapterTgz).toBeCalledWith(stream, destination)
    })

    test('call adapter tgz if .tgz extension', async () => {
        let extension = '.tgz',
            stream = faker.random.uuid(),
            destination = faker.random.uuid()
            await expect(unpacker(extension, stream, destination)).resolves.toEqual("unpacked tgz")
        expect(adapterTgz).toBeCalledWith(stream, destination)
    })
})