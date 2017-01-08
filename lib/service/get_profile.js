const getProfile = require( '../api/get_profile' );

module.exports = function () {
	return getProfile( +new Date() )
		.then( function ( json ) {
			return {
				username: json.user_name_show,
			};
		} );
};
