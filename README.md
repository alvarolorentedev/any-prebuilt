# ![logomakr_3dkn9b](https://cloud.githubusercontent.com/assets/3071208/22477192/c7ce1d86-e7aa-11e6-87de-c24336e1ea3e.png)

# Mission
Easy generation or integration of prebuilt packages. It helps fetchs prebuilt binaries from github releases.

# Generate a prebuilt package

1. Create new project
```
npm init
```
2. Add this package as dependency
```
npm install any-prebuilt --save
```
3. Create `postinstall.js` file with content:
```js
require('any-prebuilt').install(require('./package.json').prebuilt)
```
4. Create `index.js` file with content:
```js
var anyPrebuilt = require('any-prebuilt')
anyPrebuilt.initialize(__dirname, require('./package.json').prebuilt)
module.exports.path = anyPrebuilt.path
```
5. On the `package.json` add a prebuilt element (you can also add this to any other file that provides a jason object to both index and postinstall.js).
```
  "prebuilt": {
    "arch": <string>, // Target architecture (supported: `ia32` / `x64`. Default value: machine's architecture)
    "platform": <string>, //Target platform (supported: `win` / `osx` / `linux`. Default value: machine's platform)
    "version": <string>, //Target version (format: `vX.Y.Z`. Default value: latest)
    "targetDir": <string>, //Target directory (where to install the binaries. Default value: `./bin`)
    "targetBin": <string>, //Target binary (the precompiled binary to be required in node. No default value)
    "version": <string>, //Target version (format: `vX.Y.Z`. Default value: latest)
    "user": <string>, // user or Organization (format: string. Is `required`)
    "repo": <string>, //Origin repo (format: string. Is `required`)
    "token": <string> //Github token (format: string. `required` if private repo)
  }
```
6. In your `package .json` add the next script:
```
"scripts": {
    "postinstall": "node postinstall.js"
  }
```

As seen before this can be configured using a json object but also can be configured or overrided using the next enviroment variables `PREBUILT_ARCH`, `PREBUILT_PLATFORM`, `PREBUILT_VERSION`, `PREBUILT_BINARY`, `PREBUILT_TOKEN`, `PREBUILT_REPO`, `PREBUILT_USER` and `PREBUILT_TARGET_DIR` environment variables.

### Special thanks

to all the contributors to [wcjs-prebuilt](https://github.com/Ivshti/wcjs-prebuilt) that this package is based on.

### Logo
Hours graphic by <a href="http://www.flaticon.com/authors/freepik">Freepik</a> from <a href="http://www.flaticon.com/">Flaticon</a> is licensed under <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC BY 3.0</a>. Made with <a href="http://logomakr.com" title="Logo Maker">Logo Maker</a>
