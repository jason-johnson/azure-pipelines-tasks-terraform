const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');

module.exports = (env) => {
  return {
    target: "web",
    context: path.resolve(__dirname, './src'),
    entry: './index.tsx',
    output: {
      filename: "index.js",
      path: path.resolve(__dirname, "./.bin"),
    },
    devtool: "source-map",
    devServer: {
      port: 3000,
      contentBase: path.resolve(__dirname, "./.bin")
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
      alias: {
        "azure-devops-extension-sdk": path.resolve(
          "node_modules/azure-devops-extension-sdk"
        )
      }
    },
    stats: {
      warnings: false
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader"
        },
        {
          test: /\.scss$/,
          use: [
            "style-loader",
            "css-loader",
            "azure-devops-ui/buildScripts/css-variables-loader",
            "sass-loader"
          ]
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        },
        {
          test: /\.woff$/,
          use: [
            {
              loader: "base64-inline-loader"
            }
          ]
        },
        {
          test: /\.html$/,
          use: "file-loader"
        }
      ]
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [{ from: "**/*.html" }]
      }),
      new webpack.DefinePlugin({
        'process.env.TEST': env.test
      })
    ]
  }
};
