module.exports = {
    publicPath: '',
    devServer: {
        proxy: {
            '/api': {
                target: 'http://tour.12301cn.cn',
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
