jest.mock('request-promise-native', () => ({ get: jest.fn() }))
const retriever = require('../../lib/retriever'),
    { faker } = require('@faker-js/faker')
    request = require('request-promise-native')

describe('retriever package', () => {
    let onMock = jest.fn()

    beforeEach(() => {
        request.get.mockImplementation(() => {
            return {
                on: onMock
            }
        })
    })

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
        await retriever.getPackage(url, token)
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
        await retriever.getPackage(url)
        expect(request.get).toBeCalledWith(settings)
    })

    test('retrieve returns result from request', async () => {
        let url = faker.internet.url()
        let expectResult = {on: () =>{}, a : faker.datatype.uuid()}
        request.get.mockReturnValue(expectResult)

        let result = await retriever.getPackage(url)

        expect(result).toEqual(expectResult)

    })
})

describe('retriever package info', () => {
    let manifest

    beforeEach(() => {
        manifest = {
            platform: 'all',
            arch: 'all',
            user: faker.datatype.uuid(),
            repo: faker.datatype.uuid(),
            token: faker.datatype.uuid(),
            version: faker.datatype.uuid(),
            targetDir: faker.datatype.uuid()
        } 
    })

    test('should query package endpoint for latest version', async () => {
        manifest.version = 'latest'
        manifest.token = undefined
        let expectedUrl = 'https://api.github.com/repos/'+ manifest.user +'/'+ manifest.repo + '/releases/' 
                    + 'latest'
        let settings = { 
                url: expectedUrl,
                json: true,
                headers: {
                    'User-Agent': 'request',
                }
            }
        await retriever.getReleaseInfo(manifest)
        expect(request.get).toBeCalledWith(settings)
    })

    test('should query package endpoint for tag version', async () => {
        manifest.token = undefined
        let expectedUrl = 'https://api.github.com/repos/'+ manifest.user +'/'+ manifest.repo + '/releases/' 
                    + 'tags/' + manifest.version
                    + (manifest.token? ('?access_token='+manifest.token) : '')
        let settings = { 
                url: expectedUrl,
                json: true,
                headers: {
                    'User-Agent': 'request',
                }
            }
        await retriever.getReleaseInfo(manifest)
        expect(request.get).toBeCalledWith(settings)
    })

    test('should query package endpoint with token token', async () => {
        let expectedUrl = 'https://api.github.com/repos/'+ manifest.user +'/'+ manifest.repo + '/releases/' 
                    + 'tags/' + manifest.version
                    + '?access_token='+manifest.token
        let settings = { 
                url: expectedUrl,
                json: true,
                headers: {
                    'User-Agent': 'request',
                }
            }
        await retriever.getReleaseInfo(manifest)
        expect(request.get).toBeCalledWith(settings)
    })
})

// function getPrebuilt(data) {
//     return new Promise(function(resolve, reject) {
//         var releaseURL = 'https://api.github.com/repos/'+ data.user +'/'+ data.repo + '/releases/' 
//                             + (data.version === 'latest' ? 'latest' : ('tags/' + data.version))
//                             + (data.token? ('?access_token='+data.token) : '')
//         console.log('');
//         console.log('Looking for prebuilt at ' + releaseURL);
//         console.log('');
//         getJson(releaseURL)
//             .then(function(json) {
//                 if (json.message === 'Not Found') {
//                     reject('No prebuilt release found at the searched URL');
//                 }
//                 var candidate = null;

//                 _.every(json.assets, function(asset) {
//                     var assetParsed = path.parse(asset.name).name.replace('.tar', '').split('_');
                    
//                     var assetRuntime = {
//                         arch: assetParsed[3],
//                         platform: assetParsed[2]
//                     };
//                     if (_.isEqual(data.runtime, assetRuntime)){
//                         candidate = asset;
//                         console.log(asset.name, '\x1b[32m', 'matching environment' + (data.version === 'latest' ? ': continuing for more recent release' : ''), '\x1b[0m');
//                         return data.version === 'latest';
//                     }
//                     else{
//                         console.log(asset.name, '\x1b[31m', 'not matching environment' ,'\x1b[0m');
//                         return true;
//                     }
//                 });
                
//                 console.log('');

//                 if (!candidate) {
//                     reject('No Prebuilt release found matching your environment');
//                 }

//                 console.log('Acquiring: ', candidate.name);

//                 downloader.downloadAndUnpack(data.dir, candidate.name, candidate.url, data.token)
//                     .then(function() {
//                         resolve(data)
//                     }).catch(console.log);
//             })
//             .catch(reject)
//     });
// }