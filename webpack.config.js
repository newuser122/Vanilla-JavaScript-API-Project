const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/script.js',
  output: {
    filename: 'bundle.[contenthash].js', // md5 hash
    path: path.resolve(__dirname, './dist'), // generate all the possible paths to the module
    // publicPath: '', // where to take the public files from
  },
  mode: 'development', // 'none', 'production', 'development'
  module: {
    rules: [
      {
        test: /\.(png|jpg)$/,
        type: 'asset/resource',
      },
      {
        test: /\.svg/,
        type: 'asset/inline',
        parser: {
          dataUrlCondition: {
            maxSize: 3 * 1024, // less then 3kb goes to asset/inline
          },
        },
      },
      {
        test: /\.txt/,
        type: 'asset/source',
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'], // the order is very relevant, webpack processes from right to left
      },
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: babel - loader,
      //     options: {
      //       presets: ['@babel/env'], // downgrading from ECMAScript 6,7,8,9,10 down to ECMAScript 5.
      //       plugins: ['@babel/plugin-proposal-class-properties'], // support class properties for css
      //     },
      //   },
      // },
    ],
  },
  plugins: [
    new TerserPlugin(), // make the bundle file smaller
    new MiniCssExtractPlugin({ filename: 'style.[contenthash].css' }), // all css files to one fil
    new CleanWebpackPlugin(), // clean the path folder before every build
    new HtmlWebpackPlugin({
      // injecting the hashed md5 from the [hashcontent] to the html link style
      inject: 'body', // so the JS script will be in the body element
    }),
  ],
};
