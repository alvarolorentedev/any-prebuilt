const installer = require('../../lib/installer')
var fs = require('fs')
var path = require('path')

describe('download should', () => {

    test('install latest version', async () => {
        let manifest = {
            "arch": "x64",
            "platform": 'osx',
            "targetDir": path.join(__dirname,'temp'),
            "version": "latest",
            "user": "kanekotic",
            "repo": "any-prebuilt-test",
            "token": process.env.GITHUB_TEST_TOKEN
          }
        await installer(manifest)
        expect(fs.existsSync(path.join(__dirname,'temp', 'test', 'hello.txt'))).toBeTruthy()
        fs.unlinkSync(path.join(__dirname,'temp', 'test', 'hello.txt'))
    })
    
})