const API = require( '../api' );

module.exports = API.create( {
	method: 'post',
	url: 'http://tieba.baidu.com/c/c/forum/sign',
	raw: true,
} );
