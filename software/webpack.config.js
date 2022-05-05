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
                test: /\.js$/,
                exclude: /node_modules/,
                use: "babel-loader"
            }
        ]
    }
};

const rendererConfig = {
    entry: "./src/renderer/main.js",
    target: "electron-renderer",
    output: {
        filename: "szopinski-cnc-diploma.renderer.js",
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
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        })
    ]
};

module.exports = [mainConfig, rendererConfig];
