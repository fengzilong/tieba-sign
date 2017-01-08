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

module.exports = {
	GBK2UTF8: GBK2UTF8,
	delay: delay,
}
