/*
 * @Author: gyx
 * @Date: 2020-09-22 13:50:33
 * @Description: 重写vue-cli配置
 */
// 引入path模块
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir) // path.join(__dirname)设置绝对路径
}

module.exports = {
  devServer: {
    proxy: {
      '/Api': {
        target: 'https://jzt3.hnjtjt.com/', // 远程办公测试服务器
        changeOrigin: true, // 开启跨域
      },
    },
  },
  chainWebpack: config => {
    config.module.rule('svg').exclude.add(resolve('src/icons')).end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  },
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/variables.sass` 这个文件
        // 注意：在 sass-loader v8 中，这个选项名是 "prependData"
        prependData: `@import "~@/styles/theme.scss";`
      },
      scss: {
        prependData: `@import "~@/styles/theme.scss";`
      },
    }
  },
  lintOnSave: false
}
