const repeat = function( char, count ) {
	char = char + '';
	return new Array( count + 1 ).join( char );
};

const padZero = function( str, count ) {
	str = str + '';
	if( str.length < count ) {
		str = repeat( '0', count - str.length ) + str;
	}
	return str;
};

module.exports = function () {
	const t = new Date();
	const y = t.getFullYear() + '';
	const m = padZero( t.getMonth() + 1, 2 );
	const d = padZero( t.getDate(), 2 );
	return y + '-' + m + '-' + d;
};
