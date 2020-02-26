module.exports = {
  devServer: {
    public: '0.0.0.0:8080',
    disableHostCheck: true
  },
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    }
  }
}
