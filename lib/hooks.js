const webpack = require('webpack')
// eslint-disable-next-line global-require
const { RawSource } = webpack.sources || require('webpack-sources')
const { generateGitVersion } = require('./helpers')

const beforeRunHook = (
  { emitCountMap, gitversionFileName },
  compiler,
  callback
) => {
  const emitCount = emitCountMap.get(gitversionFileName) || 0
  emitCountMap.set(gitversionFileName, emitCount + 1)

  /* istanbul ignore next */
  if (callback) {
    callback()
  }
}

const emitHook = function emit(
  { compiler, emitCountMap, gitversionAssetId, gitversionFileName, options },
  compilation
) {
  const emitCount = emitCountMap.get(gitversionFileName) - 1
  emitCountMap.set(gitversionFileName, emitCount)

  const isLastEmit = emitCount === 0
  if (isLastEmit) {
    const gitVersion = generateGitVersion() || {}
    // generate
    compilation.emitAsset(
      gitversionAssetId,
      new RawSource(options.serialize(gitVersion))
    )
  }
}

module.exports = {
  beforeRunHook,
  emitHook,
}
