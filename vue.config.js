const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true

})

module.exports = {
  lintOnSave: false,
};


module.exports = {
  devServer: {
    headers: {
      'Content-Security-Policy': "script-src 'self' 'unsafe-eval';"
    }
  }
};module.exports = {
  devServer: {
    proxy: 'http://localhost:5000',
  },
};
module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:5000", // ব্যাকএন্ড URL
        changeOrigin: true,
        pathRewrite: { "^/api": "" },
      },
    },
  },
};
