const co = require( 'co' );
const skipAd = require( '../api/skip_ad' );

module.exports = co.wrap( function * () {
	yield skipAd();
} );
