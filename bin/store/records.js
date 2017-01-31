const Conf = require( 'conf' );
const _ = require( '../../lib/helpers' );
const getDate = _.getDate;

const conf = new Conf( {
	configName: 'records',
} );

module.exports = {
	save: function( type, record ) {
		const records = conf.get( getDate() + '.' + type ) || [];
		records.push( record );
		conf.set( getDate() + '.' + type, records );
	},
	load: function( type ) {
		return conf.get( getDate() + '.' + type ) || [];
	},
	clear: function() {
		conf.clear();
	},
};
