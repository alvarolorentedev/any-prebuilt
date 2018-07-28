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

const installer = require('../../lib/installer'),
    platform = require('../../lib/helpers/data-mapper'),
    retriever = require('../../lib/retriever'),
    faker = require('faker'),
    download = require('../../lib/download')

describe('index', () => {
    beforeEach(() => {
        download.mockClear()
    })
    test('exports install', async () => {
        let manifest = { something: faker.random.uuid() },
            mappedManifest = { 
                dir: faker.random.uuid(),
                token: faker.random.uuid()
             },
            mappedResponse = { something: faker.random.uuid() }
            mappedAsset = { 
                name: faker.random.uuid(),
                url: faker.random.uuid() 
            }

        platform.manifest.map.mockReturnValue(mappedManifest)
        retriever.getReleaseInfo.mockReturnValue(Promise.resolve(mappedResponse))
        platform.releases.map.mockReturnValue(mappedAsset)
        download.mockReturnValue(Promise.resolve("All cool"))
        
        await installer(manifest)
        
        expect(platform.manifest.map).toBeCalledWith(manifest)
        expect(platform.manifest.validate).toBeCalledWith(mappedManifest)
        expect(retriever.getReleaseInfo).toBeCalledWith(mappedManifest)
        expect(platform.releases.map).toBeCalledWith(mappedResponse, mappedManifest)
        expect(download).toBeCalledWith(mappedManifest.dir , mappedAsset.name, mappedAsset.url, mappedManifest.token)
    })

    test('exports fails if no asset match', async () => {
        let manifest = { something: faker.random.uuid() }

        platform.releases.map.mockReturnValue(undefined)
        try {
            await installer(manifest)
            expect(true).toBeFalsy()
        } catch (error) {
            expect(error).toEqual("there is no asset in github matching the manifest")
        }
        expect(download).not.toBeCalled()
    })
})