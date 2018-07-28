jest.mock('../../lib/helpers/platform', () => ({
    map: jest.fn(), 
    validate: jest.fn()
}))
jest.mock('../../lib/retriever', () => ({
    getReleaseInfo: jest.fn()
}))
const installer = require('../../lib/installer'),
    platform = require('../../lib/helpers/platform'),
    retriever = require('../../lib/retriever'),
    faker = require('faker')

describe('index', () => {
    test('exports install', async () => {
        let manifest = { something: faker.random.uuid() },
            mappedManifest = { something: faker.random.uuid() }

        platform.map.mockReturnValue(mappedManifest)
        
        installer(manifest)
        
        expect(platform.map).toBeCalledWith(manifest)
        expect(platform.validate).toBeCalledWith(mappedManifest)
        expect(retriever.getReleaseInfo).toBeCalledWith(mappedManifest)
    })
})