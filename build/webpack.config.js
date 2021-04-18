const { merge } = require('webpack-merge');

const commonConfig = require('./webpack.common');
const productionConfig = require('./webpack.prod');
const developmentConfig = require('./webpack.dev');

module.exports = (env) => {
  const { development, production } = env;
  if (development) return merge(commonConfig, developmentConfig);
  if (production) return merge(commonConfig, productionConfig);
  throw new Error('No matching configuration was found!');
};
