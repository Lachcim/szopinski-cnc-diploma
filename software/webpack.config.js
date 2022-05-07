const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const mainConfig = {
    entry: "./src/main/main.js",
    target: "electron-main",
    output: {
        filename: "szopinski-cnc-diploma.main.js",
        path: path.resolve(__dirname, "build")
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: "babel-loader"
            }
        ]
    }
};

const rendererConfig = {
    entry: "./src/renderer/main.jsx",
    target: "electron-renderer",
    output: {
        filename: "szopinski-cnc-diploma.renderer.js",
        path: path.resolve(__dirname, "build")
    },
    devtool: false,
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-react"]
                    }
                }
            },
            {
                test: /.scss$/,
                exclude: /node_modules/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader"
                ]
            },
            {
                test: /.ttf/,
                type: "asset/resource"
            }
        ]
    },
    node: {
        __filename: true,
        __dirname: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        })
    ],
    resolve: {
        extensions: [".js", ".jsx"]
    }
};

module.exports = [mainConfig, rendererConfig];
