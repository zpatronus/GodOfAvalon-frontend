const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: [],
  devServer: {
    historyApiFallback: true
  },
  chainWebpack: config => {
    // Remove cache-loader
    config.module.rule('js').uses.delete('cache-loader');
    config.module.rule('ts').uses.delete('cache-loader');
    config.module.rule('vue').uses.delete('cache-loader');
  }
});
