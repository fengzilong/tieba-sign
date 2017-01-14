const API = require( '../api' );

module.exports = API.create( {
	method: 'post',
	url: 'http://tieba.baidu.com/c/f/forum/like',
	raw: true,
} );
