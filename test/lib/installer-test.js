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
const installer = require('../../lib/installer'),
    platform = require('../../lib/helpers/data-mapper'),
    retriever = require('../../lib/retriever'),
    faker = require('faker')

describe('index', () => {
    test('exports install', async () => {
        let manifest = { something: faker.random.uuid() },
            mappedManifest = { something: faker.random.uuid() },
            mappedResponse = { something: faker.random.uuid() }

        platform.manifest.map.mockReturnValue(mappedManifest)
        retriever.getReleaseInfo.mockReturnValue(Promise.resolve(mappedResponse))
        
        await installer(manifest)
        
        expect(platform.manifest.map).toBeCalledWith(manifest)
        expect(platform.manifest.validate).toBeCalledWith(mappedManifest)
        expect(retriever.getReleaseInfo).toBeCalledWith(mappedManifest)
        expect(platform.releases.map).toBeCalledWith(mappedResponse, mappedManifest)
    })
})