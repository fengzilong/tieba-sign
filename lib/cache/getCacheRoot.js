const path = require( 'path' );

const folder = '.tieba-sign';

var cachePath = '';
if ( process.env.HOME && !process.env.HOMEPATH ) {
	cachePath = path.resolve( process.env.HOME, folder );
} else if ( process.env.HOME || process.env.HOMEPATH ) {
	cachePath = path.resolve(
		process.env.HOMEDRIVE, process.env.HOME || process.env.HOMEPATH,
		folder
	);
} else {
	cachePath = path.resolve( '/etc', folder );
}

module.exports = function () {
	return cachePath;
}
