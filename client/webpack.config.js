const path = require("path");

//Simplify creating an HTML file for webpack
const HtmlWebpackplugin = require("html-webpack-plugin");
const config = () => {
  return {
    mode: "development",
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "build"),
      filename: "main.js",
    },
    devServer: {
      static: path.resolve(__dirname, "build"),
      compress: true,
      port: 3000,
    },
    plugins: [
      new HtmlWebpackplugin({
        template: "./src/index.html",
        filename: "index.html",
      }),
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: "babel-loader",
          options: { presets: ["@babel/preset-react", "@babel/preset-env"] },
        },
      ],
    },
    devtool: "source-map",
  };
};

module.exports = config;
