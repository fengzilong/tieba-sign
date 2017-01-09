const path = require( 'path' );
const co = require( 'co' );
const loadJsonFile = require( 'load-json-file' );
const getCacheRoot = require( './getCacheRoot' );
const cacheRoot = getCacheRoot();

module.exports = co.wrap( function * ( bduss ) {
	const cookiePath = path.resolve( cacheRoot, 'cookie' );
	const json = yield loadJsonFile( cookiePath );
	return json || {};
} );
