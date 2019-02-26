const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    entry: {
        "DifferenceChart": './src/Charts/DifferenceChart/index.tsx',
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: `[name].js`,
        publicPath: './dist',
    },
    plugins: [
        new webpack.WatchIgnorePlugin([
            /\.d\.ts$/
        ]),
        new MiniCssExtractPlugin({
            filename: 'preact-charts.css',
            chunkFilename: 'preact-charts_[name].css'
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /.css$/g,
        }),
    ],
    module: {
        rules: [
            {test: /\.css$/,
                use: [{loader: MiniCssExtractPlugin.loader}, {
                    loader: 'typings-for-css-modules-loader',
                    options: {
                        modules: true,
                        namedExport: true,
                        localIdentName: '[path][local]'
                    }
                }]},
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
                options: {
                    configFileName: path.resolve(__dirname, 'tsconfig.json'),
                }
            },
        ]
    },
    resolve: {
        alias: {
            'preact': path.resolve(__dirname, './node_modules/preact'),
        },
        extensions: ['.ts', '.tsx', '.js', '.css'],
    },
    externals: {
        preact: {
            commonjs: "preact",
            commonjs2: "preact",
            amd: "preact",
            root: "preact"
        },
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    ecma: 8,
                    warnings: false,
                    parse: {},
                    compress: {drop_console: true},
                    mangle: true,
                    module: false,
                    output: null,
                    toplevel: false,
                    nameCache: null,
                    ie8: false,
                    keep_classnames: false,
                    keep_fnames: false,
                    safari10: false,
                }
            }),
        ]
    },
}
