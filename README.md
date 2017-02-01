# ![logomakr_3dkn9b](https://cloud.githubusercontent.com/assets/3071208/22477192/c7ce1d86-e7aa-11e6-87de-c24336e1ea3e.png)

## Mission
Easy integration of prebuilt packages or generation of prebuilt related repositories. It fetchs prebuilt binaries from github releases

## Installation

```
npm install any-prebuilt
```

## Configuration

Before installing the package, you may need to configure a few things. Here's the list of configurable items:
  - Origin user or Organization (format: string. Is `required`)
  - Origin repo (format: string. Is `required`)
  - Github token (format: string. `required` if private repo)
  - Target architecture (supported: `ia32` / `x64`. Default value: machine's architecture)
  - Target platform (supported: `win` / `osx` / `linux`. Default value: machine's platform)
  - Target version (format: `vX.Y.Z`. Default value: latest)
  - Target directory (where to install the binaries. Default value: `./bin`)
  - Target binary (the precompiled binary to be required in node. No default value)
 
There are 2 ways you can configure these elements this:
  - With the `PREBUILT_ARCH`, `PREBUILT_PLATFORM`, `PREBUILT_VERSION`, `PREBUILT_BINARY`, `PREBUILT_TOKEN`, `PREBUILT_REPO`, `PREBUILT_USER` and `PREBUILT_TARGET_DIR` environment variables. Here's an example:

  ```
  PREBUILT_USER=<user or organization> PREBUILT_REPO<repo> npm install prebuilt-prebuilt
  ```
  - By adding a `prebuilt` hash to your root `package.json` and defining the following keys: `arch`, `platform`, `version`, `targetDir`, `targetBin`, `user`, `repo` or `token`. Here's an example:
  
  ```
  "prebuilt": {
    "version": "<tag>",
    "user": "<user or organization>",
    "repo": "<repo>",
    "token": "<token if private>" 
  }
  ```

### State

Under development, not on production yet.

### Special thanks

to all the contributors to [wcjs-prebuilt](https://github.com/Ivshti/wcjs-prebuilt) that this package is based on.

### Logo
Hours graphic by <a href="http://www.flaticon.com/authors/freepik">Freepik</a> from <a href="http://www.flaticon.com/">Flaticon</a> is licensed under <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC BY 3.0</a>. Made with <a href="http://logomakr.com" title="Logo Maker">Logo Maker</a>
