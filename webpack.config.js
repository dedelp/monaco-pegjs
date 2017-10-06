var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
	entry: [
		'react-hot-loader/patch',
		// activate HMR for React

		'webpack-dev-server/client?http://localhost:3000',
		// bundle the client for webpack-dev-server
		// and connect to the provided endpoint

		'webpack/hot/only-dev-server',
		// bundle the client for hot reloading
		// only- means to only hot reload for successful updates

		'./src/example/index.js',
		// the entry point of our app
	],

	output: {
		filename: 'bundle.js',
		// the output bundle

		path: path.resolve(__dirname, 'dist'),

		publicPath: '/static/'
		// necessary for HMR to know where to load the hot update chunks
	},

	devtool: 'inline-source-map',

	module: {
		rules: [
			{
				test: /\.js?$/,
				use: [
					'babel-loader',
				],
				exclude: /node_modules/,
			},
			{
				test: /\.pegjs$/,
				loader: 'raw-loader'
			},
			{
				test: /\.scss$/,
				use: [{
					loader: "style-loader"
				}, {
					loader: "css-loader", options: {
						sourceMap: true,
						modules: true
					}
				}, {
					loader: "sass-loader", options: {
						sourceMap: true
					}
				}]
			}
		],
	},

	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		// enable HMR globally

		new webpack.NamedModulesPlugin(),
		// prints more readable module names in the browser console on HMR updates

		new webpack.NoEmitOnErrorsPlugin(),
		// do not emit compiled assets that include errors
		new CopyWebpackPlugin([
			{
				from: 'node_modules/monaco-editor/min/vs',
				to: 'vs'
			}
		])
	],

	devServer: {
		host: 'localhost',
		port: 3500,

		historyApiFallback: true,
		// respond to 404s with index.html

		hot: true,
		// enable HMR on the server
	},
};