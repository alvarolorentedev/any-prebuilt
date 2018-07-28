const platform = require('./helpers/data-mapper')
    retriever = require('./retriever')

const install = manifest => {
    let mappedManifest = platform.map(manifest)
    platform.validate(mappedManifest)
    retriever.getReleaseInfo(mappedManifest)
}
module.exports = install