jest.mock('../../lib/helpers/data-mapper', () => ({
    manifest : { 
        map: jest.fn(), 
        validate: jest.fn() 
    }, 
    releases : { 
        map: jest.fn()
    }
}))

jest.mock('../../lib/retriever', () => ({
    getReleaseInfo: jest.fn()
}))

jest.mock('../../lib/download', () => jest.fn())
jest.mock('../../lib/helpers/logger', () => ({
    log: jest.fn()
}))

const installer = require('../../lib/installer'),
    platform = require('../../lib/helpers/data-mapper'),
    retriever = require('../../lib/retriever'),
    { faker } = require('@faker-js/faker'),
    logger = require('../../lib/helpers/logger'),
    download = require('../../lib/download')

describe('index', () => {
    beforeEach(() => {
        download.mockClear()
    })
    test('exports install', async () => {
        let manifest = { 
                version: faker.datatype.uuid(),  
                platform: faker.datatype.uuid(),  
                arch: faker.datatype.uuid(),  
                targetDir: faker.datatype.uuid(),  
            },
            mappedManifest = { 
                runtime : { something: faker.datatype.uuid() },
                dir: faker.datatype.uuid(),
                token: faker.datatype.uuid()
             },
            mappedResponse = { something: faker.datatype.uuid() }
            mappedAsset = { 
                name: faker.datatype.uuid(),
                url: faker.datatype.uuid() 
            },
            expectedMessageManifest = `Fetching prebuilt:\n version:${manifest.version} \n\nPlatform:${manifest.platform}\nArch:${manifest.arch},\nTarget dir:${manifest.targetDir}`,
            expectedMessageMapAssets = `${mappedAsset.name} matched the environment`
            expectedMessageDownload = 'Prebuilt downloaded'

        platform.manifest.map.mockReturnValue(mappedManifest)
        retriever.getReleaseInfo.mockReturnValue(Promise.resolve(mappedResponse))
        platform.releases.map.mockReturnValue(mappedAsset)
        download.mockReturnValue(Promise.resolve("All cool"))
        
        await installer(manifest)
        
        
        expect(platform.manifest.map).toBeCalledWith(manifest)
        expect(platform.manifest.validate).toHaveBeenNthCalledWith(1, mappedManifest)
        expect(logger.log).toBeCalledWith(expectedMessageManifest)
        expect(retriever.getReleaseInfo).toBeCalledWith(mappedManifest)
        expect(platform.releases.map).toBeCalledWith(mappedResponse, mappedManifest.runtime)
        expect(logger.log).toHaveBeenNthCalledWith(2, expectedMessageMapAssets)
        expect(download).toBeCalledWith(mappedManifest.dir , mappedAsset.name, mappedAsset.url, mappedManifest.token)
        expect(logger.log).toHaveBeenNthCalledWith(3, expectedMessageDownload)
        
    })

    test('exports fails if no asset match', async () => {
        let manifest = { something: faker.datatype.uuid() }

        platform.releases.map.mockReturnValue(undefined)
        try {
            await installer(manifest)
            expect(true).toBeFalsy()
        } catch (error) {
            expect(error).toEqual("there is no asset in github matching the environment")
        }
        expect(download).not.toBeCalled()
    })
})