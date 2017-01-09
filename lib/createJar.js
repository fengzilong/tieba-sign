const request = require( 'request' );

function createJar( cookies ) {
	cookies = cookies || [];

	const jar = request.jar();
	cookies.forEach( function ( cookie ) {
		jar.setCookie( request.cookie( cookie[ 0 ] ), cookie[ 1 ] );
	} );
	return jar;
}

module.exports = createJar;
