require('dotenv').config();
const path = require('path');
const WebpackFn = require('./webpack.fn');
const HtmlWpPluginLists = WebpackFn.htmlWpPlugin();

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    polyfills: './src/assets/js/polyfills.js',
    vendor: './src/assets/js/vendor.js',
    main: './src/assets/js/main.js',
  },
  output: {
    filename: './assets/js/[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
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
      filename: './assets/css/[name].css',
    }),
  ],
  devtool: 'eval-source-map',
  devServer: {
    /*  publicPath: path.resolve(__dirname, 'src', 'assets'), */
    /* contentBase: [path.join(__dirname)], */
    open: true,
    host: process.env.WP_HOST || 'localhost',
    port: process.env.WP_PORT || 8080,
  },
};
