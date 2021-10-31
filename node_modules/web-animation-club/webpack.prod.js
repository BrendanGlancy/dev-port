const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "web-animation-club.min.js",
    path: path.resolve(__dirname, "dist"),
    library: "wac",
    libraryTarget: "umd",
    globalObject: "this"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["es2015", "stage-0"]
        }
      }
    ]
  }
};
