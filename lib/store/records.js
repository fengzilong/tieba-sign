const Conf = require( 'conf' );
const _ = require( '../helpers' );
const getDate = _.getDate;

const conf = new Conf( {
	configName: 'records',
} );

module.exports = {
	save( type, record ) {
		const records = conf.get( getDate() + '.' + type ) || [];
		records.push( record );
		conf.set( getDate() + '.' + type, records );
	},
	load( type ) {
		return conf.get( getDate() + '.' + type ) || [];
	},
};
