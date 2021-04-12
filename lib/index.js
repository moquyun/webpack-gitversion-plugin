const { relative, resolve } = require('path')
const { beforeRunHook, emitHook } = require('./hooks')

const emitCountMap = new Map()

const defaults = {
  fileName: 'gitversion.json',
  serialize(content) {
    return JSON.stringify(content, null, 2)
  },
  writeToFileEmit: false,
}

class WebpackGitversionPlugin {
  constructor(opts = {}) {
    this.options = { ...defaults, ...opts }
  }

  apply(compiler) {
    const gitversionFileName = resolve(
      compiler.options.output.path,
      this.options.fileName
    )

    const gitversionAssetId = relative(
      compiler.options.output.path,
      gitversionFileName
    )

    const beforeRun = beforeRunHook.bind(this, {
      emitCountMap,
      gitversionFileName,
    })

    /**
     * @compiler
     * entryOption : 在 webpack 选项中的 entry 配置项 处理过之后，执行插件。
     * afterPlugins : 设置完初始插件之后，执行插件。
     * compilation : 编译创建之后，生成文件之前，执行插件。。
     * emit : 生成资源到 output 目录之前。
     * done : 编译完成。
     */
    const emit = emitHook.bind(this, {
      compiler,
      emitCountMap,
      gitversionAssetId,
      gitversionFileName,
      options: this.options,
    })

    // normalModuleLoader

    const hookOptions = {
      name: 'WebpackGitversionPlugin',
      stage: Infinity,
    }

    compiler.hooks.emit.tap(hookOptions, emit)

    // build runtime执行
    compiler.hooks.run.tap(hookOptions, beforeRun)
    compiler.hooks.watchRun.tap(hookOptions, beforeRun)
  }
}

module.exports = { WebpackGitversionPlugin }
