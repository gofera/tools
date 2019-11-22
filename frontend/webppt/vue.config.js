module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
	assetsDir: 'static',
	devServer: {
		proxy: 'http://localhost:20199',
	},
};
