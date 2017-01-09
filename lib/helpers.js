const iconv = require( 'iconv-lite' );
const buffer = require( 'buffer' );
const Buffer = buffer.Buffer;

function GBK2UTF8( content ) {
	return iconv.decode( new Buffer( content, 'binary' ), 'gbk' ).toString();
}

function delay( timeout ) {
	return new Promise( function ( resolve, reject ) {
		setTimeout( function () {
			resolve();
		}, timeout || 0 );
	} );
}

function repeat( char, count ) {
	char = char + '';
	return new Array( count + 1 ).join( char );
}

function padZero( str, count ) {
	str = str + '';
	if( str.length < count ) {
		str = repeat( '0', count - str.length ) + str;
	}
	return str;
}

function getDate() {
	const t = new Date();
	const y = t.getFullYear() + '';
	const m = padZero( t.getMonth() + 1, 2 );
	const d = padZero( t.getDate(), 2 );
	return y + '-' + m + '-' + d;
}

module.exports = {
	GBK2UTF8: GBK2UTF8,
	delay: delay,
	getDate: getDate,
};
