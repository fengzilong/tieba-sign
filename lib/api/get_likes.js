const API = require( '../api' );

module.exports = API.create( {
	url: 'http://tieba.baidu.com/f/like/mylike',
	headers: {
		'User-Agent': 'Mozilla/5.0 (SymbianOS/9.3; Series60/3.2 NokiaE72-1/021.021; Profile/MIDP-2.1 Configuration/CLDC-1.1 ) AppleWebKit/525 (KHTML, like Gecko) Version/3.0 BrowserNG/7.1.16352'
	},
	encoding: 'binary',
	params: [
		'pn', // pageNo
		'v', // timestamp
	],
} );
