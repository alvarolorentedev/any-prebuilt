//TODO: make configurable package

module.exports = require((process.env.PREBUILT_TARGET || './bin') + (process.env.PREBUILT_BINARY || '"/prebuilt.node"'));