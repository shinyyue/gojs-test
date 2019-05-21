const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = {
    entry: './main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        chunkFilename: 'js/[name].chunk.js',
        publicPath: '/' // 路由刷新不会丢失页面
    },
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                exclude: path.resolve('./index.html')
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192
                    }
                }]
            }
            // {
            //     test: /\.js$/,
            //     loader: 'eslint-loader',
            //     enforce: "pre",
            //     include: [path.resolve(__dirname, 'views')], // 指定检查的目录
            //     options: { // 这里的配置项参数将会被传递到 eslint 的 CLIEngine 
            //         formatter: require('eslint-friendly-formatter') // 指定错误报告的格式规范
            //     }
            // }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve('./index.html'),
        }),
        new webpack.HotModuleReplacementPlugin() // 热更新
    ]
}

config.devServer = {
    port: 4001,
    host: '0.0.0.0',
    overlay: {
        errors: true, //编译过程中如果有任何错误，都会显示到页面上
    },
    open: true, // 自动帮你打开浏览器
    hot: true
}

module.exports = config