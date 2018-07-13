jest.mock('request', () => {
    return jest.fn()
})
const retriever = require('../../../lib/helpers/retriever'),
    faker = require('faker')
    request = require('request')

describe('retriever', () => {
    test('retriever calls get with correct settings with token for private repos', async () => {
        let url = faker.internet.url(),
            token = faker.internet.url(),
            settings = { 
            url: url, 
            method: 'GET',
            headers: {
                'User-Agent': 'request',
                Accept: 'application/octet-stream'
            },
            auth: {
                bearer: token,
                sendImmediately: true
            }
        }
        await retriever(url, token)
        expect(request).toBeCalledWith(settings)
    })

    test('retriever calls get with correct settings without token for public repos', async () => {
        let url = faker.internet.url(),
            settings = { 
            url: url, 
            method: 'GET',
            headers: {
                'User-Agent': 'request',
                Accept: 'application/octet-stream'
            }
        }
        await retriever(settings.url)
        expect(request).toBeCalledWith(settings)
    })
})