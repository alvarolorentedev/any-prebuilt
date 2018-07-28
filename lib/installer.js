const platform = require('./helpers/data-mapper'),
    retriever = require('./retriever'),
    download = require('./download'),
    logger = require('./helpers/logger')

const install = async manifest => {
    let mappedManifest = platform.manifest.map(manifest)
    platform.manifest.validate(mappedManifest)
    logger.log(`Fetching prebuilt:\n version:${manifest.version} \n\nPlatform:${manifest.platform}\nArch:${manifest.arch},\nTarget dir:${manifest.targetDir}`)
    let mappedReleases = await retriever.getReleaseInfo(mappedManifest)
    asset = platform.releases.map(mappedReleases, mappedManifest)
    if(!asset)
        throw "there is no asset in github matching the environment"
    logger.log(`${asset.name} matched the environment`)
    await download(mappedManifest.dir, asset.name, asset.url, mappedManifest.token)
    logger.log('Prebuilt downloaded')
}

module.exports = install 