const API = require( '../api' );

module.exports = API.create( {
	method: 'POST',
	url: 'http://c.tieba.baidu.com/c/c/forum/sign',
	encoding: 'binary',
	raw: true,
} );
