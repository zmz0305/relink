require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'public');
var APP_DIR = path.resolve(__dirname);

var config = {
   entry: APP_DIR + '/main.js',
	
   output: {
      path: BUILD_DIR,
      filename: 'index.js',
   },

   devServer: {
      inline: true,
      port: 8080
   },
	
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ['babel-loader?presets[]=react,presets[]=es2015'],
            },
            {
                test: /\.html$/,
                loader: "file?name=[name].[ext]"
            }
        ]
    }
}

module.exports = config;
