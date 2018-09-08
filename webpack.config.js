const path = require('path');
const webpack = require('webpack');
const nib = require('nib');
const jeet = require('jeet');
const rupture = require('rupture');

module.exports = {
    mode: "development",
    entry: {
        popup: path.join(__dirname, "src/popup/index.tsx"),
        eventPage: path.join(__dirname, "src/eventPage.ts"),
        clientScript: path.join(__dirname, "src/clientScript.ts"),
        contentScript: path.join(__dirname, "src/contentScript.ts")
    },
    devtool: "inline-source-map",
    output: {
        path: path.join(__dirname, "dist/js"),
        filename: "[name].js"
    },
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.tsx?$/,
                use: "ts-loader"
            },
            {
                exclude: /node_modules/,
                test: /\.styl$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'stylus-loader'
                    },
                ],
            },
            {
                test: /\.(png|eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader?name=[name].[ext]'
            }
        ]
    },

    plugins: [
        new webpack.LoaderOptionsPlugin({
            options: {
                stylus: {
                    use: [nib(), jeet(), rupture()]
                },
                context: '/'
            }
        }),
    ],

    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    }
};
