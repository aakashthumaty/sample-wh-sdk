const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
	// Other rules...
	
	module: {
		rules: [
		  {
			test: /\.js$/,
			exclude: /node_modules/,
			use: {
			  loader: "babel-loader"
			}
		  }
		]
	  },
	plugins: [
		new NodePolyfillPlugin()
	],
	resolve: {
        extensions: ['.js', '.jsx']
    }
};