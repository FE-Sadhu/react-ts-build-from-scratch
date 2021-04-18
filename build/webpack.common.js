const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    App: path.resolve(__dirname, '../src/App.js'),
  },
  output: {
    filename: '[name].[contenthash].js', // 内容改变就生成不同的哈希值。若要避开浏览器强缓存，利用该 hash 值改变文件名
    path: path.resolve(__dirname, '../dist'),
    clean: true, // 每次构建前清理 /dist 文件夹，这样只会生成用到的文件
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource', // webpack 5 内置的 Assets Modules
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Production',
    }),
  ],
  optimization: {
    // (webpack 5 内置了)
    moduleIds: 'deterministic', // 目的是为了改变(增加/删除)模块的引入(import)时，不会影响到第三方库的 vendor chunk 文件的内容 hash 值
    // (webpack 5 内置了)
    // 将 webpack 自己的 runtime 代码拆分为一个单独的 chunk。将其设置为 single 来为所有 chunk 创建一个 runtime bundle
    // (不拆分 runtime webpack 代码的话，每次打包后的 bundle 的 contenthash 值都会变，尽管文件内容没变)
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all', // async 只识别动态引入的分割方式，识别不了同步引入。 'all' 的话就都可以识别
      minSize: 20000, // 只有当引入的模块大小至少大于 20kb 时，才作分割
      minRemainingSize: 0, // 拆分后剩余的最小 chunk 的大小至少大于 0
      minChunks: 1, // 模块最小引入过 1 次，才会分割
      maxAsyncRequests: 30, // 拆分数量最多为 30
      maxInitialRequests: 30, // 首屏渲染能加载的最多 chunk 数量为 30
      enforceSizeThreshold: 50000,
      cacheGroups: {
        // defaultVendors 组的配置是将代码中使用到的第三方库提取到单独的 vendor chunk 文件中，因为这些第三方库的代码不容易变化，当再次构建时，大概率不会变，则可以命中 client 强缓存机制
        defaultVendors: {
          // 分割第三方模块
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10, // 符合 cacheGroups 多个 group 条件的模块，以这个为优先级以示应用哪个 group 的条件拆分
          reuseExistingChunk: true, // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块。
          // 比如 index.js 引入了 a.js、b.js，但其实 a.js 里引入了 b.js，所以拆分 a.js 的 chunk 后，其他文件再引入 b.js 就不会被拆分了，因为已经拆分了的 a.js 包含了 b.js。
        },
        default: {
          // 分割自己写的模块
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true, // 比如 index.js 引入了 a.js、b.js，但其实 a.js 里引入了 b.js，所以拆分 a.js 的 chunk 后，其他文件再引入 b.js 就不会被拆分了，因为已经拆分了的 a.js 的 chunk 包含了 b.js。
        },
      },
    },
  },
};
