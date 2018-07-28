const installer = require('../../lib/installer')
var fs = require('fs');
describe('download should', () => {

    test('install latest version', async () => {
        let manifest = {
            "arch": "x64",
            "platform": 'osx',
            "targetDir": "./temp",
            "version": "latest",
            "user": "kanekotic",
            "repo": "any-prebuilt-test"
          }
        await installer(manifest)
        expect(fs.existsSync("./temp/test/hello.txt")).toBeTruthy()
        fs.unlinkSync("./temp/test/hello.txt")
    })
    
})