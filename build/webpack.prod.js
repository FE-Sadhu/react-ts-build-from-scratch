const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  mode: 'production', // 手动配置为 production 时，默认打包后 tree shaking 掉未引用的代码且压缩、混淆
  devtool: 'source-map',
  optimization: {
    minimizer: [
      // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
      // `...`,
      new CssMinimizerPlugin(), // 压缩 css。  若想在开发环境也压缩，配置 optimization.minimize: true
    ],
  },
};
