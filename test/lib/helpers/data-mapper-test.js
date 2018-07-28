const platform = require('../../../lib/helpers/data-mapper'),
    faker = require('faker')

describe('map should', () => {
    let manifest

    const OLD_ENV = process.env
    const OLD_GETINFO = platform._.getInfo

    beforeEach(() => {
        process.env = { ...OLD_ENV }
        delete process.env.PREBUILT_TARGET_DIR
        delete process.env.PREBUILT_VERSION
        delete process.env.PREBUILT_ARCH
        delete process.env.PREBUILT_PLATFORM
        delete process.env.PREBUILT_USER
        delete process.env.PREBUILT_REPO
        delete process.env.PREBUILT_TOKEN
        manifest = {
            platform: 'all',
            arch: 'all',
            user: faker.random.uuid(),
            repo: faker.random.uuid(),
            token: faker.random.uuid(),
            version: faker.random.uuid(),
            targetDir: faker.random.uuid()
        } 
        platform._.getInfo = jest.fn((() => 'linux:x64'))
      });

      afterEach(() => {
        process.env = OLD_ENV
        platform._.getInfo = OLD_GETINFO
      });

    ['osx', 'windows', 'linux', 'all']
    .forEach((param) => {
        test(`accept ${param} as platform`, async () => {
            manifest.platform = param
            expect(platform.manifest.map(manifest).runtime.platform).toEqual(manifest.platform)
        })
    });

    test('platform as environment variable PREBUILT_PLATFORM', async () => {
        process.env.PREBUILT_PLATFORM = 'linux'
        expect(platform.manifest.map(manifest).runtime.platform).toEqual(process.env.PREBUILT_PLATFORM)
    });

    ['ia32', 'x64', 'all']
    .forEach((param) => {
        test(`accept ${param} as architecture`, async () => {
            manifest.arch = param
    
            expect(platform.manifest.map(manifest).runtime.arch).toEqual(manifest.arch)
        })
    });

    test('architecture as environment variable PREBUILT_ARCH', async () => {
        process.env.PREBUILT_ARCH = 'x64'
        expect(platform.manifest.map(manifest).runtime.arch).toEqual(process.env.PREBUILT_ARCH)
    });

    test('should try to map even if undefined manifest', async () => {
        try {
            platform.manifest.map(undefined)
        } catch (error) {
            expect(true).toBeFalsy()
        }
    });

    test('architecture as second parameter of _.getInfo', async () => {
        manifest.arch = undefined
        platform._.getInfo.mockImplementation( () => 'linux:x64')
        expect(platform.manifest.map(manifest).runtime.arch).toEqual('x64')
    })

    test('architecture as second parameter of _.getInfo', async () => {
        manifest.platform = undefined
        platform._.getInfo.mockImplementation( () => 'linux:x64')
        expect(platform.manifest.map(manifest).runtime.platform).toEqual('linux')
    })

    test('user as environment variable PREBUILT_USER', async () => {
        process.env.PREBUILT_USER = faker.random.uuid()
        expect(platform.manifest.map(manifest).user).toEqual(process.env.PREBUILT_USER)
    });


    test('accept random string as user', async () => {
        expect(platform.manifest.map(manifest).user).toEqual(manifest.user)
    });
    test('accept random string as repo', async () => {
        expect(platform.manifest.map(manifest).repo).toEqual(manifest.repo)
    });

    test('repo as environment variable PREBUILT_REPO', async () => {
        process.env.PREBUILT_REPO = faker.random.uuid()
        expect(platform.manifest.map(manifest).repo).toEqual(process.env.PREBUILT_REPO)
    });

    test('accept random string as token', async () => {
        expect(platform.manifest.map(manifest).token).toEqual(manifest.token)
    });

    test('token as environment variable PREBUILT_TOKEN', async () => {
        process.env.PREBUILT_TOKEN = faker.random.uuid()
        expect(platform.manifest.map(manifest).token).toEqual(process.env.PREBUILT_TOKEN)
    });

    test('accept random string as version', async () => {
        expect(platform.manifest.map(manifest).version).toEqual(manifest.version)
    });

    test('default version as latest', async () => {
        manifest.version = undefined
        expect(platform.manifest.map(manifest).version).toEqual('latest')
    });

    test('version as environment variable PREBUILT_VERSION', async () => {
        process.env.PREBUILT_VERSION = faker.random.uuid()
        expect(platform.manifest.map(manifest).version).toEqual(process.env.PREBUILT_VERSION)
    });

    test('accept random string as targetDir', async () => {
        expect(platform.manifest.map(manifest).targetDir).toEqual(manifest.targetDir)
    });

    test('default targetDir as ./bin', async () => {
        manifest.targetDir = undefined
        expect(platform.manifest.map(manifest).targetDir).toEqual('./bin')
    });

    test('targetDir as environment variable PREBUILT_TARGET_DIR', async () => {
        process.env.PREBUILT_TARGET_DIR = faker.random.uuid()
        expect(platform.manifest.map(manifest).targetDir).toEqual(process.env.PREBUILT_TARGET_DIR)
    });
})


describe('getInfo should', () => {
    beforeEach(() => {
      platform._.getArchitecture = jest.fn()
      platform._.getPlatform = jest.fn()
    });

    test('should return linux:ia32 when is that architecture', async () => {
        platform._.getArchitecture.mockImplementation( () => 32)
        platform._.getPlatform.mockImplementation( () => "linux")
        expect(platform._.getInfo()).toEqual('linux:ia32')
    })

    test('should return linux:x64 when is that architecture', async () => {
        platform._.getArchitecture.mockImplementation( () => 64)
        platform._.getPlatform.mockImplementation( () => "linux")
        expect(platform._.getInfo()).toEqual('linux:x64')
    })

    test('should return osx:ia32 when is that architecture', async () => {
        platform._.getArchitecture.mockImplementation( () =>  'ia32')
        platform._.getPlatform.mockImplementation( () => "darwin")
        expect(platform._.getInfo()).toEqual('osx:ia32')
    })

    test('should return osx:x64 when is that architecture', async () => {
        platform._.getArchitecture.mockImplementation( () => 'x64')
        platform._.getPlatform.mockImplementation( () => "darwin")
        expect(platform._.getInfo()).toEqual('osx:x64')
    })

    test('should return windows:ia32 when is that architecture', async () => {
        platform._.getArchitecture.mockImplementation( () => 'ia32')
        platform._.getPlatform.mockImplementation( () => "win")
        expect(platform._.getInfo()).toEqual('windows:ia32')
    })

    test('should return windows:x64 when is that architecture', async () => {
        platform._.getArchitecture.mockImplementation( () => 'x64')
        platform._.getPlatform.mockImplementation( () => "win")
        expect(platform._.getInfo()).toEqual('windows:x64')
    })
})

describe('validate should', () => {

    let manifest
    beforeEach(() => {
        manifest = {
            runtime: {
                platform: 'all',
                arch: 'all',
            },
            user: faker.random.uuid(),
            repo: faker.random.uuid(),
            token: faker.random.uuid(),
            version: faker.random.uuid(),
            targetDir: faker.random.uuid()
        } 
      });

    ['22223344', 'wodds', undefined]
    .forEach((param) => {
        test(`not accept ${param} as platform`, async () => {
            manifest.runtime.platform = param
            try {
                platform.manifest.validate(manifest)
                expect(true).toBeFalsy()
            } catch (error) {
                expect(error).toEqual("Unsupported platform")
            }
        })
    });

    ['22223344', 'wodds', undefined]
    .forEach((param) => {
        test(`not accept ${param} as arch`, async () => {
            manifest.runtime.arch = param
            try {
                platform.manifest.validate(manifest)
                expect(true).toBeFalsy()
            } catch (error) {
                expect(error).toEqual("Unsupported architecture")
            }
        })
    });

    [undefined, null]
    .forEach((param) => {
        test(`not accept ${param} as user`, async () => {
            manifest.user = param
            try {
                platform.manifest.validate(manifest)
                expect(true).toBeFalsy()
            } catch (error) {
                expect(error).toEqual("User needs to be defined")
            }
        })
        test(`not accept ${param} as user`, async () => {
            manifest.repo = param
            try {
                platform.manifest.validate(manifest)
                expect(true).toBeFalsy()
            } catch (error) {
                expect(error).toEqual("Repository needs to be defined")
            }
        })
    });
    
})    

describe('map assets', () => {

    beforeEach(() => {
      });

    test(`extract architecture and platform from assests`, async () => {
        let url = faker.internet.url(),
            expectedArch = faker.random.uuid(),
            expectePlatform = faker.random.uuid(),
            filename = `${faker.random.uuid()}_${expectePlatform}_${expectedArch}.zip`
            settings = { arch: expectedArch, platform: expectePlatform },
            requestResult = {
                assets:[
                    {
                        name: `${url}/${filename}`
                    }
                ]
            }

        expect(platform.releases.map(requestResult, settings)).toEqual(requestResult.assets[0])
    })
})
