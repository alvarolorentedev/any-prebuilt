jest.mock('path', () => ({
    basename: jest.fn().mockImplementation((name) =>{
        return `pepe/${name}`
    })
}))

const fileSystem = require('../../../lib/helpers/file-system'),
    path = require('path')
    faker = require('faker')

describe('file-system is windows function ', () => {
    const OLD_PLAT = process.platform

    beforeEach(() => {
      process.platform = { ...OLD_PLAT }
      delete process.platform
    });
  
    afterEach(() => {
      process.platform = OLD_PLAT
    });

    test('should be true for platform windows', async () => {
        process.platform = 'win32'
        expect(fileSystem.isWindows()).toEqual(true)
    });
    test('should be false for platform linux', async () => {
        process.platform = 'linux'
        expect(fileSystem.isWindows()).toEqual(false)
    });
    test('should be false for platform osx', async () => {
        process.platform = 'darwin'
        expect(fileSystem.isWindows()).toEqual(false)
    });
})

describe('file-system file mapper Tgz', () => {
    beforeEach(() => {
        fileSystem._files.length = 0
      });

    test('should be true for platform windows', async () => {
        let header = {name : faker.random.uuid()}
        expect(fileSystem.fileMapperTgz(header)).toEqual(header)
        expect(fileSystem._files).toEqual([{path: `pepe/${header.name}`}])
    });
})

describe('file-system file mapper Zip', () => {
    beforeEach(() => {
        fileSystem._files.length = 0
      });

    test('should be true for platform windows', async () => {
        let entry = {
            path : `pepe/${faker.random.uuid()}`,
            mode : `${faker.random.uuid()}`
        }
        expect(fileSystem.fileMapperZip(entry)).toEqual(true)
        expect(fileSystem._files).toEqual([{path: entry.path,
            mode : entry.mode }])
    });
})