const md5 = require( './md5' );

module.exports = function encrypt( data ) {
	const SIGN_KEY = 'tiebaclient!!!';
	var s = '';
	for( var i in data ) {
		s += i + '=' + data[ i ];
	}
	const sign = md5( decodeURIComponent( s ) + SIGN_KEY );
	var result = '';
	for( var i in data ) {
		result += '&' + i + '=' + data[ i ];
	}
	result += '&sign=' + sign;
	return result.replace( '&', '' );
}
