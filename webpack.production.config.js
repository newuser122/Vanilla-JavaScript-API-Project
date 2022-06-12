const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './src/script.js', // add as many files as you like for more then a single page application
  },
  output: {
    filename: '[name].[contenthash].js', // [name is the entry name of the file], [md5 hash]
    path: path.resolve(__dirname, './dist'), // generate all the possible paths to the module
    // publicPath: '', // where to take the public files from
  },
  mode: 'production', // 'none', 'production', 'development'
  optimization: {
    // relevant only to production because of the application running optimization, not the build optimization
    splitChunks: {
      chunks: 'all', // caching bundles separately and uses them where needed in the html files
      minSize: 3 * 1024, // the default minimum size bundle size in 30kb
    },
  },
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
      {
        test: /\.hbs$/,
        use: ['handlebars-loader'],
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
    new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }), // all css files to one fil
    new CleanWebpackPlugin(), // clean the path folder before every build
    new HtmlWebpackPlugin({
      // injecting the hashed md5 from the [hashcontent] to the html link style
      // for each html file you need to create another HtmlWebpackPlugin like the below
      filename: 'index.html',
      template: './src/index.hbs',
      chunks: ['index'], // same name as the entry name
      title: 'index',
      description: 'index',
      inject: 'body', // so the JS script will be in the body element
    }),
  ],
};
