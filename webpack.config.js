var path = require('path');
var webpack = require("webpack");
var TransferWebpackPlugin = require('transfer-webpack-plugin'); //拷贝文件

//webpck插件
var plugins = [  
  new TransferWebpackPlugin([
    {from:'./src',to:"/"}    
    ]),
  // 使用 ProvidePlugin 加载使用率高的依赖库
  new webpack.ProvidePlugin({
    $: 'jquery'  
  })
];
var entry = [
    './src/app'],
  buildPath = "/build/release/";
  
//编译输出路径
module.exports = {
  debug: true,
  entry: entry,
  output: {
     path: __dirname + buildPath,
    filename: 'js/build.js',
    
    chunkFilename: "js/[name].chunk.[chunkhash:8].js" //给require.ensure用
  },
  module: {      
     loaders: [{
      test: /\.css$/,
      loader:"style-loader!css-loader"
    },{
      test: /\.(jpg|png|gif)$/,
      loader: "file-loader?name=images/[name].[hash].[ext]"
    }, {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: "url-loader?limit=10000&minetype=application/font-woff"
    }, {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: "file-loader"
    }, {
      test: /\.json$/,
      loader: 'json'
    }]    
  },

  resolve: {
    // require时省略的扩展名，如：require('module') 不需要module.js
    extension: ['', '.js', '.css'],
    //别名
    alias: {
      jquery: path.join(__dirname, 'lib/jquery/jquery-1.9.1.js'),
      avalon: path.join(__dirname, 'lib/avalon/avalon'), //在正常情况下我们以CommonJS风格引用avalon,以require('avalon')            
    }
  },
  plugins: plugins,
  devtool: '#source-map'
};