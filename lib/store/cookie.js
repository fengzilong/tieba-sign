const Conf = require( 'conf' );

const conf = new Conf( {
	configName: 'cookie',
} );

module.exports = {
	save( cookie ) {
		conf.set( cookie )
	},
	load() {
		return conf.store;
	},
};
