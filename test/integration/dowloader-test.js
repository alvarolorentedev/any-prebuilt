const download = require('../../lib/download')
var fs = require('fs');
describe('download should', () => {

    test('uncompress zip file in correct path', async () => {
        await download('./temp', 'test.zip', 'https://github.com/kanekotic/any-prebuilt-test/releases/download/0.0.1/test_osx_x64.zip')
        expect(fs.existsSync("./temp/test/hello.txt")).toBeTruthy()
        fs.unlinkSync("./temp/test/hello.txt")
    })
    
    test('uncompress tgz file in correct path', async () => {
        await download('./temp', 'test.tgz', 'https://github.com/kanekotic/any-prebuilt-test/releases/download/0.0.1/test_osx_x64.tgz')
        expect(fs.existsSync("./temp/test/hello.txt")).toBeTruthy()
        fs.unlinkSync("./temp/test/hello.txt")
    })
    
})

