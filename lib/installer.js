const platform = require('./helpers/data-mapper'),
    retriever = require('./retriever'),
    download = require('./download')

const install = async manifest => {
    let mappedManifest = platform.manifest.map(manifest)
    platform.manifest.validate(mappedManifest)
    let mappedReleases = await retriever.getReleaseInfo(mappedManifest)
    asset = platform.releases.map(mappedReleases, mappedManifest)
    if(!asset)
        throw "there is no asset in github matching the manifest"
    await download(mappedManifest.dir, asset.name, asset.url, mappedManifest.token )
}

module.exports = install 