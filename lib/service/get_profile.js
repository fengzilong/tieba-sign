const co = require( 'co' );
const getProfile = require( '../api/get_profile' );

module.exports = co.wrap( function * () {
	const resp = yield getProfile( +new Date() );
	const json = JSON.parse( resp );
	if ( json ) {
		return { username: json.data.user_name_show };
	}

	return { username: void 0 };
} );
