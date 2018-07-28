jest.mock('path', () => ({
    basename: jest.fn((name) =>{
        return `pepe/${name}`
    }),
    join: jest.fn()
}))
jest.mock('fs-extra', () => ({
    readdirSync: jest.fn(),
    statSync: jest.fn(),
    copy: jest.fn((_, __, cb) => cb()),
    remove: jest.fn((_, cb) => cb())
}))

const fileSystem = require('../../../lib/helpers/file-system'),
    path = require('path'),
    fs = require('fs-extra'),
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

describe('file-system strip root folder', () => {
    beforeEach(() => {
        path.join.mockClear()
        fs.readdirSync.mockClear()
        fs.copy.mockClear()
        fs.remove.mockClear()
      });

    test('should strip root folder', async () => {
        let params = {
                destination : `pepe/${faker.random.uuid()}`
            },
            readdirResult = [faker.random.uuid()],
            joinResult = faker.random.uuid(),
            statSyncResult = {
                isDirectory: () => true
            }

        fs.readdirSync.mockReturnValue(readdirResult)
        path.join.mockReturnValue(joinResult)
        fs.statSync.mockReturnValue(statSyncResult)
        
        await fileSystem.stripRootFolder(params)
        
        expect(fs.readdirSync).toBeCalledWith(params.destination)
        expect(path.join).toBeCalledWith(params.destination,readdirResult[0])
        expect(fs.copy).toBeCalledWith(joinResult, params.destination, expect.anything())
        expect(fs.remove).toBeCalledWith(joinResult, expect.anything())
        
    });
    
    test('reject if copy fails', async () => {
        let params = {
                destination : `pepe/${faker.random.uuid()}`
            },
            readdirResult = [faker.random.uuid()],
            joinResult = faker.random.uuid(),
            statSyncResult = {
                isDirectory: () => true
            }

        fs.readdirSync.mockReturnValue(readdirResult)
        path.join.mockReturnValue(joinResult)
        fs.statSync.mockReturnValue(statSyncResult)
        fs.copy.mockImplementation(jest.fn((_, __, cb) => cb("error")))
        
        await expect(fileSystem.stripRootFolder(params)).rejects.toEqual("error")
        
        expect(fs.readdirSync).toBeCalledWith(params.destination)
        expect(path.join).toBeCalledWith(params.destination,readdirResult[0])
        expect(fs.copy).toBeCalledWith(joinResult, params.destination, expect.anything())
        expect(fs.remove).not.toBeCalled()
        
    });
    
    test('should not strip root folder of not subfolder', async () => {
        let params = {
                destination : `pepe/${faker.random.uuid()}`
            },
            readdirResult = [],
            joinResult = faker.random.uuid()

        fs.readdirSync.mockReturnValue(readdirResult)
        path.join.mockReturnValue(joinResult)

        await fileSystem.stripRootFolder(params)
        
        expect(fs.readdirSync).toBeCalledWith(params.destination)
        expect(path.join).not.toBeCalled()
        expect(fs.copy).not.toBeCalled()
        expect(fs.remove).not.toBeCalled()
        
    });
    
    test('should not strip root folder if is not directory', async () => {
        let params = {
                destination : `pepe/${faker.random.uuid()}`
            },
            readdirResult = [faker.random.uuid()],
            joinResult = faker.random.uuid(),
            statSyncResult = {
                isDirectory: () => false
            }

        fs.readdirSync.mockReturnValue(readdirResult)
        path.join.mockReturnValue(joinResult)
        fs.statSync.mockReturnValue(statSyncResult)

        fs.readdirSync.mockReturnValue(readdirResult)
        path.join.mockReturnValue(joinResult)

        await fileSystem.stripRootFolder(params)
        
        expect(fs.readdirSync).toBeCalledWith(params.destination)
        expect(path.join).toBeCalledWith(params.destination,readdirResult[0])
        expect(fs.copy).not.toBeCalled()
        expect(fs.remove).not.toBeCalled()
        
    });
})

describe('file-system move file', () => {
    beforeEach(() => {
        fs.copy.mockClear()
        fs.remove.mockClear()
      });

    test('should move files if no error', async () => {
        let destination = faker.system.directoryPath(),
            cachePath =faker.system.directoryPath()
        
        fs.copy.mockImplementation(jest.fn((_, __, cb) => cb()))

        await fileSystem.move(cachePath, destination)
        
        expect(fs.copy).toBeCalledWith(cachePath, destination, expect.anything())
        expect(fs.remove).toBeCalledWith(cachePath, expect.anything())
        
    });
    test('should reject if error on copy', async () => {
        let destination = faker.system.directoryPath(),
            cachePath =faker.system.directoryPath()

        fs.copy.mockImplementation(jest.fn((_, __, cb) => cb("Error")))

        await expect(fileSystem.move(cachePath, destination)).rejects.toEqual("Error")
        
        expect(fs.copy).toBeCalledWith(cachePath, destination, expect.anything())
        expect(fs.remove).not.toBeCalled()
        
    });
});
