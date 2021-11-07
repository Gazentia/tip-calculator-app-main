const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports.htmlWpPlugin = function () {
  const dir = './src/';
  const extFilter = new RegExp(/\.html$/);
  const fileLists = fs.readdirSync(path.resolve(__dirname, 'src'));
  const htmlFiles = fileLists.filter((filename) => extFilter.test(filename));
  const result = htmlFiles.map(filename => {
      return new HtmlWebpackPlugin({
        filename: filename.replace(/\.html$/, '.html'),
        template: dir + filename,
        inject: "body",
        scriptLoading: "defer",
      });
  });
  return result;
};

module.exports.assetHanlder = function(url, resourcePath, context) {
  const relativePath = path
    .relative(context, resourcePath)
    .replace(/\\/g, '/')
    .replace(/^src\//, './');
  return relativePath;
}