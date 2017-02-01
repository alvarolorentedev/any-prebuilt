var needle = require('needle'),
    _ = require('lodash'),
    path = require('path'),
    downloader = require('./downloader'),
    fs = require('fs-extra')

function getPlatformInfo() {
    if (/linux/.test(process.platform)) {
        return process.arch == 32 ? 'linux:ia32' : 'linux:x64'
    } else if (/darwin/.test(process.platform)) {
        return 'osx:' + process.arch
    } else {
        return 'windows:' + process.arch
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getJson(url) {
    return new Promise(function(resolve, reject) {
        needle.get(url, {
            json: true
        }, function(err, resp) {
            if (err || !resp.body)
                return reject('Something went very wrong: ' + (err || "no body!?!?!"));
            resolve(resp.body)
        });
    })
}

function getPrebuilt(data) {
    return new Promise(function(resolve, reject) {
        var releaseURL = 'https://api.github.com/repos/'+ data.user +'/'+ data.repo + '/releases/' 
                            + (data.version === 'latest' ? 'latest' : ('tags/' + data.version))
                            + (data.token? ('?access_token='+data.token) : '')
        console.log('');
        console.log('Looking for prebuilt at ' + releaseURL);
        console.log('');
        getJson(releaseURL)
            .then(function(json) {
                if (json.message === 'Not Found') {
                    reject('No prebuilt release found at the searched URL');
                }
                var candidate = null;

                _.every(json.assets, function(asset) {
                    var assetParsed = path.parse(asset.name).name.replace('.tar', '').split('_');
                    
                    var assetRuntime = {
                        arch: assetParsed[3],
                        platform: assetParsed[2]
                    };
                    if (_.isEqual(data.runtime, assetRuntime)){
                        candidate = asset;
                        console.log(asset.name, '\x1b[32m', 'matching environment' + (data.version === 'latest' ? ': continuing for more recent release' : ''), '\x1b[0m');
                        return data.version === 'latest';
                    }
                    else{
                        console.log(asset.name, '\x1b[31m', 'not matching environment' ,'\x1b[0m');
                        return true;
                    }
                });
                
                console.log('');

                if (!candidate) {
                    reject('No Prebuilt release found matching your environment');
                }

                console.log('Acquiring: ', candidate.name);
                console.log('Acquiring: ', candidate.browser_download_url);

                console.log('Acquiring: ', candidate.url);
                downloader.downloadAndUnpack(data.dir, candidate.name, candidate.url, data.token)
                    .then(function() {
                        resolve(data)
                    }).catch(console.log);
            })
            .catch(reject)
    });
}

function parseEnviroment(manifest) {
    var supported = {
        platforms: ['osx', 'windows', 'linux'],
        arch: ['ia32', 'x64']
    }

    return new Promise(function(resolve, reject) {

        var inf = manifest ? manifest : {}

        var platform = process.env.PREBUILT_PLATFORM || inf.platform || getPlatformInfo().split(':')[0]
        var arch = process.env.PREBUILT_ARCH || inf.arch || getPlatformInfo().split(':')[1]
        var version = process.env.PREBUILT_VERSION || inf.version || 'latest'
        var targetDir = process.env.PREBUILT_TARGET_DIR || inf.targetDir || './bin'

        var user = process.env.PREBUILT_USER || inf.user;
        var repo = process.env.PREBUILT_REPO || inf.repo;
        var token = process.env.PREBUILT_TOKEN || inf.token;

        console.log('token is: ' + process.env.PREBUILT_TOKEN)

        fs.mkdirsSync(targetDir)

        console.log('Fetching prebuilt' + ':', '\n version:', version, 
            '\n'+ '\nPlatform:', platform, '\nArch:', arch,
            '\nTarget dir:', targetDir);

        if ( !(supported.platforms.indexOf(platform) > -1) || !(supported.arch.indexOf(arch) > -1))
            return reject('Unsupported arch or platform')
        else if (!user || !repo)
            return reject('required user & repo')

        resolve({
            runtime: {
                arch: arch,
                platform: platform
            },
            dir: targetDir,
            version: version,
            user: user,
            repo: repo,
            token: token
        });
    });
}

module.exports = function install(package){
parseEnviroment(package)
    .then(getPrebuilt)
    .then(function() {
        console.log('Prebuilt downloaded');
    })
    .catch(function(e) {
        console.log(e.message || e);
        if (e.stack) console.log(e.stack);
        process.exit(1); // indicate to npm that we've quit badly
    })
}