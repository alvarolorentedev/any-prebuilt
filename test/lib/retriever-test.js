jest.mock('request-promise-native', () => ({ get: jest.fn() }))
const retriever = require('../../lib/retriever'),
    faker = require('faker')
    request = require('request-promise-native')

describe('retriever', () => {
    let onMock = jest.fn()

    beforeEach(() => {
        request.get.mockImplementation(() => {
            return {
                on: onMock
            }
        })
    })

    let defaultProgress = () => {}
    test('retriever calls get with correct settings with token for private repos', async () => {
        let url = faker.internet.url(),
            token = faker.internet.url(),
            settings = { 
            url: url, 
            headers: {
                'User-Agent': 'request',
                Accept: 'application/octet-stream'
            },
            auth: {
                bearer: token,
                sendImmediately: true
            }
        }
        await retriever(url, defaultProgress, token)
        await retriever(url, defaultProgress, token)
        expect(request.get).toBeCalledWith(settings)
    })

    test('retriever calls get with correct settings without token for public repos', async () => {
        let url = faker.internet.url(),
            settings = { 
            url: url, 
            headers: {
                'User-Agent': 'request',
                Accept: 'application/octet-stream'
            }
        }
        await retriever(url)
        expect(request.get).toBeCalledWith(settings)
    })

    test('retrieve returns result from request', async () => {
        let url = faker.internet.url()
        let expectResult = {on: () =>{}, a : faker.random.uuid()}
        request.get.mockReturnValue(expectResult)

        let result = await retriever(url)

        expect(result).toEqual(expectResult)

    })

    test('retrieve track progress', async () => {
        let url = faker.internet.url(),
            chunk = { length: faker.random.number()},
            progress = jest.fn()

        onMock.mockImplementation((type,cb) => {
            if(type == 'data')
                cb(chunk)
            else
                throw "here be dragons"
        })

        await retriever(url,progress)

        expect(progress).toBeCalledWith(chunk.length)

    })
})