const event = require( './event' );

module.exports = function () {
	/* getlikes START */
	event.on( 'getlikes:start', function ( data ) {
		console.log( 'getlikes:start', data );
	} );
	event.on( 'getlikes:process', function ( data ) {
		console.log( 'getlikes:process', data );
	} );
	event.on( 'getlikes:error', function ( error ) {
		console.log( 'getlikes:error', error );
	} );
	event.on( 'getlikes:stop', function ( data ) {
		console.log( 'getlikes:stop' );
		console.log( '共' + data.length + '个' );
	} );
	/* getlikes END */

	/* sign START */
	event.on( 'sign:success', function ( data ) {
		console.log( data.name + '吧，签到成功，经验 +' + data.point );
	} );
	event.on( 'sign:failed', function ( data ) {
		console.log( data.name + '吧，签到失败' );
	} );
	event.on( 'sign:not-support', function ( data ) {
		console.log( data.name + '吧，不支持签到' );
	} );
	event.on( 'sign:already-signed', function ( data ) {
		console.log( data.name + '吧，已签到' );
	} );
	/* sign END */
}
