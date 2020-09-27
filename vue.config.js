module.exports = {
    publicPath: '',
    devServer: {
        proxy: {
            '/api': {
                target: 'http://wx.51yzly.com',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': '/api'
                }
            }
        },
        host:'0.0.0.0'
    }
}
