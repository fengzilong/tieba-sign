const co = require( 'co' );
const getMyLikeTieba = require( '../api/get_likes' );
const event = require( '../event' );
const _ = require( '../helpers' );
const delay = _.delay;

const getTotalPageNo = co.wrap( function * () {
	var content = yield getMyLikeTieba( 1, +new Date() - 600000 );
	content = processHTML( content );

	var matched = content.match( /<a[ ]href=.*pn=(\d+)">尾页<\/a>/ );

	var totalPageNo = 1;
	if ( matched ) {
		totalPageNo = Number( matched[ 1 ] );
	}

	return totalPageNo;
} );

const getLikesByPageNo = co.wrap( function * ( pageNo ) {
	var content = yield getMyLikeTieba( pageNo || 1, +new Date() - 600000 );
	content = processHTML( content );

	const matched = content.match(/<a[ ]href=".*?(?=<\/a><\/td>)/g);

	const names = [];
	if ( matched ) {
		const MAX_SIGN_COUNT = 9999;
		for( var i = 0; i < matched.length && names.length < MAX_SIGN_COUNT; i++ ) {
			names.push( matched[ i ].replace(/<a[ ]href=".*?">/, '') );
		}
	}

	return names;
} );

function processHTML( content ) {
	content = _.GBK2UTF8( content );
	return content
		.replace(/[	]/g, '')
		.replace(/<td>\r\n/g, '<td>')
		.replace(/\r\n<\/td>/g, '</td>')
		.replace(/<span.*?span>\r\n/g, '');
}

module.exports = co.wrap( function * () {
	const totalPageNo = yield getTotalPageNo();

	const likes = [];

	event.emit( 'getlikes:start', {
		current: 1,
		total: totalPageNo,
	} );

	try {
		for ( var pageNo = 1; pageNo <= totalPageNo ; pageNo++ ) {
			event.emit( 'getlikes:process', {
				current: pageNo,
				total: totalPageNo,
			} );
			const onePageLikes = yield getLikesByPageNo( pageNo );
			[].push.apply( likes, onePageLikes );
			yield delay( 300 );
		}
	} catch ( e ) {
		event.emit( 'getlikes:error', e );
	}
	event.emit( 'getlikes:stop', likes );

	return likes;
} );
