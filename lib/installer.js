const platform = require('./helpers/data-mapper')
    retriever = require('./retriever')

const install = async manifest => {
    let mappedManifest = platform.manifest.map(manifest)
    platform.manifest.validate(mappedManifest)
    let mappedReleases = await retriever.getReleaseInfo(mappedManifest)
    platform.releases.map(mappedReleases, mappedManifest)
}

module.exports = install 