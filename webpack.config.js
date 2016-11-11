const webpack = require('webpack');
const merge = require('webpack-merge');
const WebpackNotifierPlugin = require('webpack-notifier');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

/* NODE_ENV */
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProd = NODE_ENV === 'production';
const isDev = !isProd;

console.info(`
:--------- process.env.NODE_ENV: ${NODE_ENV} ---------:
`);

let config = {
    entry: {
        index: ['./src/index.tsx', './src/index.scss']
    },
    output: {
        path: './public',
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.s?css$/,
                loader: ExtractTextPlugin.extract('css!postcss!sass')
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'ts'
            }
        ]
    },
    postcss: [autoprefixer({ browsers: ['last 2 versions'] })],
    ts: {
        compilerOptions: {
            "declaration": false
        }
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    plugins: [
        new WebpackNotifierPlugin({ title: 'Webpack' }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(NODE_ENV)
            }
        }),
        new ExtractTextPlugin('[name].bundle.css'),
        new HtmlWebpackPlugin({
            hash: true,
            template: './src/index.html'
        })
    ]
};

if (isDev) {
    config = merge(config, {
        devtool: 'inline-source-map',
        devServer: {
            contentBase: 'public',
            inline: true,
            noInfo: true
        }
    });
}

if (isProd) {
    config = merge(config, {
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                compress: { warnings: false },
            }),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.AggressiveMergingPlugin()
        ]
    });
}

module.exports = [config];