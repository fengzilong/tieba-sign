const path = require( 'path' );
const co = require( 'co' );
const writeJsonFile = require( 'write-json-file' );
const getCacheRoot = require( './getCacheRoot' );
const cacheRoot = getCacheRoot();

module.exports = co.wrap( function * ( bduss ) {
	const cookiePath = path.resolve( cacheRoot, 'cookie' );
	yield writeJsonFile( cookiePath, {
		bduss: bduss
	} );
} );
