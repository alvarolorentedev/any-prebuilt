jest.mock('../../../lib/unpack/adapter-tgz', () => jest.fn(() => "unpacked tgz"))
jest.mock('../../../lib/unpack/adapter-zip', () => jest.fn(() => "unpacked zip"))
jest.mock('fs-extra', () => ({
    mkdirsSync: jest.fn()
}))

const unpacker = require('../../../lib/unpack/unpacker'),
    adapterTgz = require('../../../lib/unpack/adapter-tgz'),
    adapterZip = require('../../../lib/unpack/adapter-zip'),
    fs = require('fs-extra'),
    { faker } = require('@faker-js/faker')

describe('unpacker should', () => {

    test('call generate destination folder', async () => {
        let extension = '.zip',
            stream = faker.datatype.uuid(),
            destination = faker.datatype.uuid()
        
        await unpacker(extension, stream, destination)
        
        expect(fs.mkdirsSync).toBeCalledWith(destination)
    })

    test('call adapter zip if .zip extension', async () => {
        let extension = '.zip',
            stream = faker.datatype.uuid(),
            destination = faker.datatype.uuid()
        await expect(unpacker(extension, stream, destination)).resolves.toEqual("unpacked zip")
        expect(adapterZip).toBeCalledWith(stream, destination)
    })

    test('call adapter tgz if .gz extension', async () => {
        let extension = '.gz',
            stream = faker.datatype.uuid(),
            destination = faker.datatype.uuid()
            await expect(unpacker(extension, stream, destination)).resolves.toEqual("unpacked tgz")
        expect(adapterTgz).toBeCalledWith(stream, destination)
    })

    test('call adapter tgz if .tgz extension', async () => {
        let extension = '.tgz',
            stream = faker.datatype.uuid(),
            destination = faker.datatype.uuid()
            await expect(unpacker(extension, stream, destination)).resolves.toEqual("unpacked tgz")
        expect(adapterTgz).toBeCalledWith(stream, destination)
    })
})