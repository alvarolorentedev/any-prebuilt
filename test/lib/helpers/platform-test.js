const platform = require('../../../lib/helpers/platform'),
    faker = require('faker')

describe('map should', () => {
    let manifest

    const OLD_ENV = process.env

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
      });

      afterEach(() => {
        process.env = OLD_ENV
      });

    ['osx', 'windows', 'linux', 'all']
    .forEach((param) => {
        test(`accept ${param} as platform`, async () => {
            manifest.platform = param
            expect(platform.map(manifest).runtime.platform).toEqual(manifest.platform)
        })
    });

    test('platform as environment variable PREBUILT_PLATFORM', async () => {
        process.env.PREBUILT_PLATFORM = 'linux'
        expect(platform.map(manifest).runtime.platform).toEqual(process.env.PREBUILT_PLATFORM)
    });

    ['ia32', 'x64', 'all']
    .forEach((param) => {
        test(`accept ${param} as architecture`, async () => {
            manifest.arch = param
    
            expect(platform.map(manifest).runtime.arch).toEqual(manifest.arch)
        })
    });

    test('architecture as environment variable PREBUILT_ARCH', async () => {
        process.env.PREBUILT_ARCH = 'x64'
        expect(platform.map(manifest).runtime.arch).toEqual(process.env.PREBUILT_ARCH)
    });

    test('should try to map even if undefined manifest', async () => {
        try {
            platform.map(undefined)
        } catch (error) {
            expect(true).toBeFalsy()
        }
    });
//         var platform = process.env.PREBUILT_PLATFORM || inf.platform || getPlatformInfo().split(':')[0]
//         var arch = process.env.PREBUILT_ARCH || inf.arch || getPlatformInfo().split(':')[1]
    test('user as environment variable PREBUILT_USER', async () => {
        process.env.PREBUILT_USER = faker.random.uuid()
        expect(platform.map(manifest).user).toEqual(process.env.PREBUILT_USER)
    });


    test('accept random string as user', async () => {
        expect(platform.map(manifest).user).toEqual(manifest.user)
    });
    test('accept random string as repo', async () => {
        expect(platform.map(manifest).repo).toEqual(manifest.repo)
    });

    test('repo as environment variable PREBUILT_REPO', async () => {
        process.env.PREBUILT_REPO = faker.random.uuid()
        expect(platform.map(manifest).repo).toEqual(process.env.PREBUILT_REPO)
    });

    test('accept random string as token', async () => {
        expect(platform.map(manifest).token).toEqual(manifest.token)
    });

    test('token as environment variable PREBUILT_TOKEN', async () => {
        process.env.PREBUILT_TOKEN = faker.random.uuid()
        expect(platform.map(manifest).token).toEqual(process.env.PREBUILT_TOKEN)
    });

    test('accept random string as version', async () => {
        expect(platform.map(manifest).version).toEqual(manifest.version)
    });

    test('default version as latest', async () => {
        manifest.version = undefined
        expect(platform.map(manifest).version).toEqual('latest')
    });

    test('version as environment variable PREBUILT_VERSION', async () => {
        process.env.PREBUILT_VERSION = faker.random.uuid()
        expect(platform.map(manifest).version).toEqual(process.env.PREBUILT_VERSION)
    });

    test('accept random string as targetDir', async () => {
        expect(platform.map(manifest).targetDir).toEqual(manifest.targetDir)
    });

    test('default targetDir as ./bin', async () => {
        manifest.targetDir = undefined
        expect(platform.map(manifest).targetDir).toEqual('./bin')
    });

    test('targetDir as environment variable PREBUILT_TARGET_DIR', async () => {
        process.env.PREBUILT_TARGET_DIR = faker.random.uuid()
        expect(platform.map(manifest).targetDir).toEqual(process.env.PREBUILT_TARGET_DIR)
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
        expect(platform.getInfo()).toEqual('linux:ia32')
    })

    test('should return linux:x64 when is that architecture', async () => {
        platform._.getArchitecture.mockImplementation( () => 64)
        platform._.getPlatform.mockImplementation( () => "linux")
        expect(platform.getInfo()).toEqual('linux:x64')
    })

    test('should return osx:ia32 when is that architecture', async () => {
        platform._.getArchitecture.mockImplementation( () =>  'ia32')
        platform._.getPlatform.mockImplementation( () => "darwin")
        expect(platform.getInfo()).toEqual('osx:ia32')
    })

    test('should return osx:x64 when is that architecture', async () => {
        platform._.getArchitecture.mockImplementation( () => 'x64')
        platform._.getPlatform.mockImplementation( () => "darwin")
        expect(platform.getInfo()).toEqual('osx:x64')
    })

    test('should return windows:ia32 when is that architecture', async () => {
        platform._.getArchitecture.mockImplementation( () => 'ia32')
        platform._.getPlatform.mockImplementation( () => "win")
        expect(platform.getInfo()).toEqual('windows:ia32')
    })

    test('should return windows:x64 when is that architecture', async () => {
        platform._.getArchitecture.mockImplementation( () => 'x64')
        platform._.getPlatform.mockImplementation( () => "win")
        expect(platform.getInfo()).toEqual('windows:x64')
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
                platform.validate(manifest)
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
                platform.validate(manifest)
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
                platform.validate(manifest)
                expect(true).toBeFalsy()
            } catch (error) {
                expect(error).toEqual("User needs to be defined")
            }
        })
        test(`not accept ${param} as user`, async () => {
            manifest.repo = param
            try {
                platform.validate(manifest)
                expect(true).toBeFalsy()
            } catch (error) {
                expect(error).toEqual("Repository needs to be defined")
            }
        })
    });
    
})    

//// function parseEnviroment(manifest) {
////     var supported = {
////         platforms: ['osx', 'windows', 'linux', 'all'],
////         arch: ['ia32', 'x64', 'all']
////     }

////     return new Promise(function(resolve, reject) {

//         var inf = manifest ? manifest : {}

//         var platform = process.env.PREBUILT_PLATFORM || inf.platform || getPlatformInfo().split(':')[0]
//         var arch = process.env.PREBUILT_ARCH || inf.arch || getPlatformInfo().split(':')[1]
////         var version = process.env.PREBUILT_VERSION || inf.version || 'latest'
////         var targetDir = process.env.PREBUILT_TARGET_DIR || inf.targetDir || './bin'

////         var user = process.env.PREBUILT_USER || inf.user;
////         var repo = process.env.PREBUILT_REPO || inf.repo;
////         var token = process.env.PREBUILT_TOKEN || inf.token;

//         fs.mkdirsSync(targetDir)

//         console.log('Fetching prebuilt' + ':', '\n version:', version, 
//             '\n'+ '\nPlatform:', platform, '\nArch:', arch,
//             '\nTarget dir:', targetDir);

////         if ( !(supported.platforms.indexOf(platform) > -1) || !(supported.arch.indexOf(arch) > -1))
////             return reject('Unsupported arch or platform')
////         else if (!user || !repo)
////             return reject('required user & repo')

////         resolve({
////             runtime: {
////                 arch: arch,
////                 platform: platform
////             },
////             dir: targetDir,
////             version: version,
////             user: user,
////             repo: repo,
////             token: token
////         });
////     });
//// }