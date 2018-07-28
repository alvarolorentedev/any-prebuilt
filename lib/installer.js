const platform = require('./helpers/platform')
    retriever = require('./retriever')

const install = manifest => {
    let mappedManifest = platform.map(manifest)
    platform.validate(mappedManifest)
    retriever.getReleaseInfo(mappedManifest)
}
module.exports = install