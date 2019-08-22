const webpack = require('webpack')
const path = require('path')

module.exports =  {
    entry: {
        app: './src/index.js'
    },
    output: {
        filename: 'index.js',
        libraryTarget: 'commonjs2',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    }
}