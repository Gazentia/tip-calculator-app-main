const path = require('path');
const WebpackFn = require('./webpack.fn');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWpPluginLists = WebpackFn.htmlWpPlugin();
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    polyfills: './src/assets/js/polyfills.js',
    vendor: './src/assets/js/vendor.js',
    main: './src/assets/js/main.js',
  },
  output: {
    filename: './assets/js/[name].[contenthash].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    //publicPath: "http://localhost:5500",
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../../',
            },
          },
          {
            loader: 'css-loader',
            options: {
              url: true,
            },
          },
          'postcss-loader',
          {
            loader: 'resolve-url-loader',
            options: {
              removeCR: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                { useBuiltIns: 'usage', corejs: { version: 3 } },
              ],
            ],
          },
        },
      },
      {
        test: /\.(svg|png|jpg|gif|webp)$/i,
        use: {
          loader: 'file-loader',
          options: {
            esModule: false,
            name: '[name].[ext]',
            outputPath: WebpackFn.assetHanlder,
          },
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: WebpackFn.assetHanlder,
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    ...HtmlWpPluginLists,
    new FaviconsWebpackPlugin({
      logo: './src/assets/images/favicon.png',
      prefix: 'assets/favicons/',
      outputPath: '/assets/favicons/',
      publicPath: './',
      inject: (htmlPlugin) => {
        return /\.(html)$/g.test(path.basename(htmlPlugin.options.filename));
      },
    }),
    new MiniCssExtractPlugin({
      filename: './assets/css/[name].[contentHash].css',
    }),
  ],
};
