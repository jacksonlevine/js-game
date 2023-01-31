const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  entry: './src/script.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {                 
    contentBase: './dist'      
  },     
  devtool: 'eval-source-map',
  plugins: [
    new ESLintPlugin(),
    new CleanWebpackPlugin({
      verbose: true
    }),
    new HtmlWebpackPlugin({
      title: 'JS Game',
      template: './src/index.html',
      inject: 'body',
      minify: false
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ],
      }
    ]
  }
};