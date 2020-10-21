module.exports = {
    publicPath: '',
    assetsDir: "./",
    devServer: {
        proxy: {
            '/api': {
                target: 'http://parkpay.citygopass.cn',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': '/'
                }
            }
        },
        host:'0.0.0.0'
    }
}
