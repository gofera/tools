module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
	assetsDir: 'static',
	devServer: {
		proxy: 'https://tramweb.asml.com/ppt/search',
	},
};
