'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var es6promise = _interopDefault(require('es6-promise'));
var mkdirp = _interopDefault(require('mkdirp'));
var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var request = _interopDefault(require('request'));
var iconv = _interopDefault(require('iconv-lite'));
var buffer = require('buffer');
var ora = _interopDefault(require('ora'));
var observable = _interopDefault(require('riot-observable'));

var SIGN_CONF_PATH = '';
if( process.env.HOME && !process.env.HOMEPATH ) {
	SIGN_CONF_PATH = path.resolve( process.env.HOME, '.tieba-sign' );
} else if( process.env.HOME || process.env.HOMEPATH ) {
	SIGN_CONF_PATH = path.resolve( process.env.HOMEDRIVE, process.env.HOME || process.env.HOMEPATH, '.tieba-sign' );
} else {
	SIGN_CONF_PATH = path.resolve('/etc', '.tieba-sign');
}

var jar = request.jar();

var jar$1 = function () {
	var COOKIE_PATH = path.resolve( SIGN_CONF_PATH, '.cookie' );

	if( fs.existsSync( COOKIE_PATH ) ) {
		var bduss = fs.readFileSync( COOKIE_PATH, 'utf-8' );
		var c = "BDUSS=" + bduss;
		var c1 = request.cookie( c );
		var c2 = request.cookie( c );
		var c3 = request.cookie( "novel_client_guide=1" );

		jar.setCookie( c1, "http://tieba.baidu.com" );
		jar.setCookie( c2, "http://c.tieba.baidu.com" );
		jar.setCookie( c3, "http://tieba.baidu.com" );
	} else {
		console.log( '请先设置cookie\nCommand: tieba-sign cookie <your cookie>' );
		process.exit();
	}
	return jar;
};

var request$1 = request.defaults({ jar: jar$1() });

var SKIP_AD = function () {
	return new Promise(function(resolve, reject) {
		request$1({
			url: 'http://tieba.baidu.com/mo/'
		}, function ( error, response, body ) {
			resolve();
		});
	});
};

var gbk2utf8 = function (content) {
	return iconv.decode( new buffer.Buffer( content, 'binary' ), 'gbk' ).toString();
};

var url = 'http://tieba.baidu.com/f/user/json_userinfo';
var USER_PROFILE = function () { return new Promise(function ( resolve, reject ) {
	request$1({
		method: 'GET',
		url: url,
		encoding: 'binary',
		qs: {
			_: +new Date()
		}
	}, function ( error, response, body ) {
		body = gbk2utf8( body );
		var json = JSON.parse( body );
		if( json && json.error === '' ) {
			resolve( json.data );
		} else {
			reject( new Error( '获取用户信息失败' ) );
		}
	});
}); };

var spinner = ora({
	spinner: {
		interval: 100,
		frames: [ '' ],
	},
	color: 'white'
});

var spin = function ( text ) {
	spinner.text = text;
};

spin.render = function () {
	spinner.render();
};

spin.start = function () {
	spinner.text = '';
	spinner.start();
	spin.isStarted = true;
};

spin.stop = function () {
	spinner.stop();
	spinner.text = '';
	spin.isStarted = false;
};

var MAX_SIGN_COUNT = 9999;

var names = [];
var totalNum;
var pageNum = 1;

function fetchLikeOne() {
	if( !spin.isStarted ) {
		spin.start();
	}

	var v = +new Date() - 600000;
	var url = "http://tieba.baidu.com/f/like/mylike?v=" + v + "&pn=" + pageNum;

	return new Promise(function ( resolve, reject ) {
		setTimeout(function () {
			request$1({ url: url, encoding: 'binary' }, function ( error, response, body ) {
				body = gbk2utf8( body );
				body = body.replace(/[	]/g, '')
					.replace(/<td>\r\n/g, '<td>')
					.replace(/\r\n<\/td>/g, '</td>')
					.replace(/<span.*?span>\r\n/g, '');

				var matched = body.match(/<a[ ]href=".*?(?=<\/a><\/td>)/g);

				if( matched ) {
					for(
						var i = 0; i < matched.length && names.length < MAX_SIGN_COUNT; i++
					) {
						names.push( matched[ i ].replace(/<a[ ]href=".*?">/, '') );
					}
				}

				if( typeof totalNum === 'undefined' ) {
					matched = body.match(/<a[ ]href=.*pn=(\d+)">尾页<\/a>/);
					if( matched ) {
						totalNum = matched[ 1 ] * 1;
					} else {
						// 只有一页时totalNum也会匹配不到
						totalNum = 1;
					}
				}

				resolve( names );
			});
		}, 1000);
	}).then(function () {
		var args = [], len = arguments.length;
		while ( len-- ) args[ len ] = arguments[ len ];

		var content = "获取喜欢的贴吧列表 " + pageNum + "/" + totalNum + "页";
		spin( content );
		// 判断是否存在下一页
		if( pageNum < totalNum ) {
			pageNum++;
			return fetchLikeOne();
		} else {
			spin.stop();
			console.log( content );
			return Promise.resolve.apply( Promise, args );
		}
	});
}

var hexcase=0;function hex_md5(s){return rstr2hex(rstr_md5(str2rstr_utf8(s)));}function rstr_md5(s){return binl2rstr(binl_md5(rstr2binl(s),s.length*8));}function rstr2hex(input){try{hexcase;}catch(e){hexcase=0;}var hex_tab=hexcase?"0123456789ABCDEF":"0123456789abcdef";var output="";var x;for(var i=0;i<input.length;i++){x=input.charCodeAt(i);output+=hex_tab.charAt((x>>>4)&0x0F)+hex_tab.charAt(x&0x0F);}return output;}function str2rstr_utf8(input){var output="";var i=-1;var x,y;while(++i<input.length){x=input.charCodeAt(i);y=i+1<input.length?input.charCodeAt(i+1):0;if(0xD800<=x&&x<=0xDBFF&&0xDC00<=y&&y<=0xDFFF){x=0x10000+((x&0x03FF)<<10)+(y&0x03FF);i++;}if(x<=0x7F){ output+=String.fromCharCode(x); }else if(x<=0x7FF){ output+=String.fromCharCode(0xC0|((x>>>6)&0x1F),0x80|(x&0x3F)); }else if(x<=0xFFFF){ output+=String.fromCharCode(0xE0|((x>>>12)&0x0F),0x80|((x>>>6)&0x3F),0x80|(x&0x3F)); }else if(x<=0x1FFFFF){ output+=String.fromCharCode(0xF0|((x>>>18)&0x07),0x80|((x>>>12)&0x3F),0x80|((x>>>6)&0x3F),0x80|(x&0x3F)); }}return output;}function rstr2binl(input){var output=Array(input.length>>2);for(var i=0;i<output.length;i++){ output[i]=0; }for(var i=0;i<input.length*8;i+=8){ output[i>>5]|=(input.charCodeAt(i/8)&0xFF)<<(i%32); }return output;}function binl2rstr(input){var output="";for(var i=0;i<input.length*32;i+=8){ output+=String.fromCharCode((input[i>>5]>>>(i%32))&0xFF); }return output;}function binl_md5(x,len){x[len>>5]|=0x80<<((len)%32);x[(((len+64)>>>9)<<4)+14]=len;var a=1732584193;var b=-271733879;var c=-1732584194;var d=271733878;for(var i=0;i<x.length;i+=16){var olda=a;var oldb=b;var oldc=c;var oldd=d;a=md5_ff(a,b,c,d,x[i+0],7,-680876936);d=md5_ff(d,a,b,c,x[i+1],12,-389564586);c=md5_ff(c,d,a,b,x[i+2],17,606105819);b=md5_ff(b,c,d,a,x[i+3],22,-1044525330);a=md5_ff(a,b,c,d,x[i+4],7,-176418897);d=md5_ff(d,a,b,c,x[i+5],12,1200080426);c=md5_ff(c,d,a,b,x[i+6],17,-1473231341);b=md5_ff(b,c,d,a,x[i+7],22,-45705983);a=md5_ff(a,b,c,d,x[i+8],7,1770035416);d=md5_ff(d,a,b,c,x[i+9],12,-1958414417);c=md5_ff(c,d,a,b,x[i+10],17,-42063);b=md5_ff(b,c,d,a,x[i+11],22,-1990404162);a=md5_ff(a,b,c,d,x[i+12],7,1804603682);d=md5_ff(d,a,b,c,x[i+13],12,-40341101);c=md5_ff(c,d,a,b,x[i+14],17,-1502002290);b=md5_ff(b,c,d,a,x[i+15],22,1236535329);a=md5_gg(a,b,c,d,x[i+1],5,-165796510);d=md5_gg(d,a,b,c,x[i+6],9,-1069501632);c=md5_gg(c,d,a,b,x[i+11],14,643717713);b=md5_gg(b,c,d,a,x[i+0],20,-373897302);a=md5_gg(a,b,c,d,x[i+5],5,-701558691);d=md5_gg(d,a,b,c,x[i+10],9,38016083);c=md5_gg(c,d,a,b,x[i+15],14,-660478335);b=md5_gg(b,c,d,a,x[i+4],20,-405537848);a=md5_gg(a,b,c,d,x[i+9],5,568446438);d=md5_gg(d,a,b,c,x[i+14],9,-1019803690);c=md5_gg(c,d,a,b,x[i+3],14,-187363961);b=md5_gg(b,c,d,a,x[i+8],20,1163531501);a=md5_gg(a,b,c,d,x[i+13],5,-1444681467);d=md5_gg(d,a,b,c,x[i+2],9,-51403784);c=md5_gg(c,d,a,b,x[i+7],14,1735328473);b=md5_gg(b,c,d,a,x[i+12],20,-1926607734);a=md5_hh(a,b,c,d,x[i+5],4,-378558);d=md5_hh(d,a,b,c,x[i+8],11,-2022574463);c=md5_hh(c,d,a,b,x[i+11],16,1839030562);b=md5_hh(b,c,d,a,x[i+14],23,-35309556);a=md5_hh(a,b,c,d,x[i+1],4,-1530992060);d=md5_hh(d,a,b,c,x[i+4],11,1272893353);c=md5_hh(c,d,a,b,x[i+7],16,-155497632);b=md5_hh(b,c,d,a,x[i+10],23,-1094730640);a=md5_hh(a,b,c,d,x[i+13],4,681279174);d=md5_hh(d,a,b,c,x[i+0],11,-358537222);c=md5_hh(c,d,a,b,x[i+3],16,-722521979);b=md5_hh(b,c,d,a,x[i+6],23,76029189);a=md5_hh(a,b,c,d,x[i+9],4,-640364487);d=md5_hh(d,a,b,c,x[i+12],11,-421815835);c=md5_hh(c,d,a,b,x[i+15],16,530742520);b=md5_hh(b,c,d,a,x[i+2],23,-995338651);a=md5_ii(a,b,c,d,x[i+0],6,-198630844);d=md5_ii(d,a,b,c,x[i+7],10,1126891415);c=md5_ii(c,d,a,b,x[i+14],15,-1416354905);b=md5_ii(b,c,d,a,x[i+5],21,-57434055);a=md5_ii(a,b,c,d,x[i+12],6,1700485571);d=md5_ii(d,a,b,c,x[i+3],10,-1894986606);c=md5_ii(c,d,a,b,x[i+10],15,-1051523);b=md5_ii(b,c,d,a,x[i+1],21,-2054922799);a=md5_ii(a,b,c,d,x[i+8],6,1873313359);d=md5_ii(d,a,b,c,x[i+15],10,-30611744);c=md5_ii(c,d,a,b,x[i+6],15,-1560198380);b=md5_ii(b,c,d,a,x[i+13],21,1309151649);a=md5_ii(a,b,c,d,x[i+4],6,-145523070);d=md5_ii(d,a,b,c,x[i+11],10,-1120210379);c=md5_ii(c,d,a,b,x[i+2],15,718787259);b=md5_ii(b,c,d,a,x[i+9],21,-343485551);a=safe_add(a,olda);b=safe_add(b,oldb);c=safe_add(c,oldc);d=safe_add(d,oldd);}return Array(a,b,c,d);}function md5_cmn(q,a,b,x,s,t){return safe_add(bit_rol(safe_add(safe_add(a,q),safe_add(x,t)),s),b);}function md5_ff(a,b,c,d,x,s,t){return md5_cmn((b&c)|((~b)&d),a,b,x,s,t);}function md5_gg(a,b,c,d,x,s,t){return md5_cmn((b&d)|(c&(~d)),a,b,x,s,t);}function md5_hh(a,b,c,d,x,s,t){return md5_cmn(b^c^d,a,b,x,s,t);}function md5_ii(a,b,c,d,x,s,t){return md5_cmn(c^(b|(~d)),a,b,x,s,t);}function safe_add(x,y){var lsw=(x&0xFFFF)+(y&0xFFFF);var msw=(x>>16)+(y>>16)+(lsw>>16);return(msw<<16)|(lsw&0xFFFF);}function bit_rol(num,cnt){return(num<<cnt)|(num>>>(32-cnt));}

function signStatus ( kw ) {
	var url = "http://tieba.baidu.com/mo/m?kw=" + (encodeURIComponent( kw ));
	var headers = {
		"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
		"User-Agent" : "Mozilla/5.0 (SymbianOS/9.3; Series60/3.2 NokiaE72-1/021.021; Profile/MIDP-2.1 Configuration/CLDC-1.1 ) AppleWebKit/525 (KHTML, like Gecko) Version/3.0 BrowserNG/7.1.16352"
	};

	return new Promise(function ( resolve, reject ) {
		request$1({ url: url, encoding: 'utf-8', headers: headers}, function ( error, response, body ) {
			var rightPart = body.match( /<td[ ]style="text-align:right;".*?<\/td>/ );

			if(
				!rightPart ||
				rightPart[ 0 ] === '<td style="text-align:right;"></td>'
			) {
				resolve({ status: -1, fid: '', tbs: '' });
			} else {
				if( rightPart[ 0 ].indexOf( '已签到' ) !== -1 ) {
					resolve({ status: 1, fid: '', tbs: '' });
				} else {
					var fid = rightPart[0].match(/fid=(\d+)/)[1];
					var tbs = rightPart[0].match(/tbs=([0-9a-f]{26})/)[1];
					resolve({ status: 0, fid: fid, tbs: tbs });
				}
			}
		});
	});
}

// sign status
var SIGN_NOT_SUPPORT$1 = -2;
var SIGN_FAIL$1 = -1;
var SIGN_SUCCESS$1 = 0;
var SIGNED$1 = 1;
// sign interval
var SIGN_INTERVAL = 638;
// others
var url$1 = "http://c.tieba.baidu.com/c/c/forum/sign";
var encode = function (data) {
	var SIGN_KEY = "tiebaclient!!!";
	var s = "";
	for( var i in data ) {
		s += i + '=' + data[i];
	}
	var sign = hex_md5( decodeURIComponent( s ) + SIGN_KEY );
	var result = '';
	for( var i$1 in data ) {
		result += '&' + i$1 + '=' + data[i$1];
	}
	result += '&sign=' + sign;
	return result.replace( '&', '' );
};

var signOne = function (name) {
	return new Promise(function ( resolve, reject ) {
		return signStatus( name ).then(function (ref) {
			var status = ref.status;
			var fid = ref.fid;
			var tbs = ref.tbs;

			setTimeout(function () {
				switch( status ) {
					case -1:
						resolve({
							status: SIGN_NOT_SUPPORT$1,
							data: {},
							message: '',
						});
						break;
					case 0:
						var data = {
							"_client_id" : "03-00-DA-59-05-00-72-96-06-00-01-00-04-00-4C-43-01-00-34-F4-02-00-BC-25-09-00-4E-36",
							"_client_type" : "4",
							"_client_version" : "1.2.1.17",
							"_phone_imei" : "540b43b59d21b7a4824e1fd31b08e9a6",
							"fid" : fid,
							"kw" : encodeURIComponent( name ),
							"net_type" : "3",
							"tbs" : tbs
						};

						request$1({ method: 'POST', url: url$1, encoding: 'binary', form: encode( data ) }, function ( error, response, body ) {
							var json;
							try {
								json = JSON.parse( body );
							} catch( e ) {
								json = {};
							}
							if( json.error_code === '0' ) {
								resolve({
									status: SIGN_SUCCESS$1,
									data: {
										point: json.user_info.sign_bonus_point,
									},
									message: ''
								});
							} else {
								// TODO: 增加失败原因
								resolve({
									status: SIGN_FAIL$1,
									data: {},
									message: '',
								});
							}
						});
						break;
					case 1:
						resolve({
							status: SIGNED$1,
							data: {},
							message: '',
						});
						break;
				}
			}, SIGN_INTERVAL);
		});
	});
};

// sign status
var SIGN_NOT_SUPPORT = -2;
var SIGN_FAIL = -1;
var SIGN_SUCCESS = 0;
var SIGNED = 1;

var sign = function (names) {
	var i = 0;
	var signed = [];
	var signFailed = [];
	var signSuccess = [];
	var signNotSupported = [];

	if( !Array.isArray( names ) ) {
		return Promise.reject( new Error( 'need pass an array as param' ) );
	}

	if( names.length === 0 ) {
		throw new Error( '无待签到贴吧' );
	}

	function signNext( name ) {
		return signOne( name )
			.then(function (ref) {
				var status = ref.status;
				var data = ref.data;
				var message = ref.message;

				// 收集
				switch( status ) {
					case SIGN_NOT_SUPPORT:
						sign.trigger( 'sign-not-support', name, i );
						signNotSupported.push( name );
						break;
					case SIGN_FAIL:
						sign.trigger( 'sign-failed', name, i );
						signFailed.push( name );
						break;
					case SIGN_SUCCESS:
						sign.trigger( 'sign-success', name, i, data.point );
						signSuccess.push( name );
						break;
					case SIGNED:
						sign.trigger( 'signed', name, i, message );
						signed.push( name );
						break;
				}

				if( i < names.length - 1 ) {
					i++;
					return signNext( names[ i ] );
				} else {
					return Promise.resolve({ signNotSupported: signNotSupported, signFailed: signFailed, signSuccess: signSuccess, signed: signed });
				}
			});
	}

	return signNext( names[ 0 ] );
};

observable( sign );

es6promise.polyfill();

var username;
var userfolder;
var folder;

var save = function ( p, v ) {
	if( fs.existsSync( p ) ) {
		var arr = fs.readFileSync( p, 'utf-8' );
		try {
			arr = JSON.parse( arr );
		} catch( e ) {
			arr = [];
		}

		if( !~arr.indexOf( v ) ) {
			arr.unshift( v );
		}

		fs.writeFileSync( p, JSON.stringify( arr, 0, 4 ) );
	}
};
var load = function (p) {
	var arr = [];
	if( fs.existsSync( p ) ) {
		var content = fs.readFileSync( p, 'utf-8' );
		try {
			arr = JSON.parse( content );
		} catch( e ) {
			arr = [];
		}
	}

	return arr;
};

sign.on('sign-not-support', function ( name, i ) {
	console.log( ((i+1) + "、" + name + " 不支持签到") );
	save( path.resolve( folder, 'not-support.json' ), name );
});
sign.on('sign-failed', function ( name, i, reason ) {
	console.log( ((i+1) + "、" + name + " 签到失败") );
});
sign.on('sign-success', function ( name, i, point ) {
	console.log( ((i+1) + "、" + name + " 签到成功，经验+" + point) );
	save( path.resolve( folder, 'signed.json' ), name );
});
sign.on('signed', function ( name, i ) {
	console.log( ((i+1) + "、" + name + " 已签到") );
	save( path.resolve( folder, 'signed.json' ), name );
});

function clearConsole() {
	process.stdout.write( '\x1bc' );
	return Promise.resolve();
}

var index = function ( ref ) {
	var root = ref.root;
	var folderName = ref.folder;

	clearConsole()
		.then( SKIP_AD )
		.then( USER_PROFILE )
		.then( function (profile) {
			username = profile.user_name_show;
			console.log( ("开始用户\"" + username + "\"的签到") );
		} )
		.then(function () {
			// 创建用户文件夹
			userfolder = path.resolve( root, (username + "/") );
			folder = path.resolve( root, (username + "/" + folderName + "/") );

			if( !fs.existsSync( folder ) ) {
				mkdirp.sync( folder );
			}

			if( !fs.existsSync( path.resolve( folder, 'not-support.json' ) ) ) {
				fs.writeFileSync( path.resolve( folder, 'not-support.json' ), '[]' );
			}
			if( !fs.existsSync( path.resolve( folder, 'signed.json' ) ) ) {
				fs.writeFileSync( path.resolve( folder, 'signed.json' ), '[]' );
			}
		})
		.then(function () {
			var allPath = path.resolve( userfolder, 'all.json' );
			if( fs.existsSync( allPath ) ) {
				var content = fs.readFileSync( allPath, 'utf-8' );
				try {
					content = JSON.parse( content );
				} catch( e ) {
					content = [];
				}
				return Promise.resolve( content );
			} else {
				return fetchLikeOne();
			}
		})
		.then(function (names) {
			// 如果贴吧列表未保存
			var allPath = path.resolve( userfolder, 'all.json' );
			if( !fs.existsSync( allPath ) ) {
				fs.writeFileSync( allPath, JSON.stringify( names, 0, 4 ) );
			}
			return Promise.resolve( names );
		})
		.then(function (names) {
			// 过滤不支持 && 已签到的贴吧
			var signed = load( path.resolve( folder, 'signed.json' ) );
			var notSupport = load( path.resolve( folder, 'not-support.json' ) );
			var exclude = signed.concat( notSupport );
			var filtered = [];
			for( var i = 0, len = names.length; i < len; i++ ) {
				if( !~exclude.indexOf( names[ i ] ) ) {
					filtered.push( names[ i ] );
				}
			}
			return Promise.resolve({
				all: names,
				filtered: filtered,
				signed: signed,
				notSupport: notSupport,
			});
		})
		.then(function (ref) {
			var all = ref.all;
			var filtered = ref.filtered;
			var signed = ref.signed;
			var notSupport = ref.notSupport;

			if( all.length > 0 ) {
				console.log( ("已签到『" + (signed.length) + "个贴吧』") );
				console.log( ("无法签到『" + (notSupport.length) + "个贴吧』") );
				console.log( ("开始签到『" + (filtered.length) + "个贴吧』") );
			} else {
				console.log( '未关注任何贴吧' );
			}
			return filtered;
		})
		.then(function (names) { return sign( names ); })
		.then(function (ref) {
			var signNotSupported = ref.signNotSupported;
			var signFailed = ref.signFailed;
			var signSuccess = ref.signSuccess;
			var signed = ref.signed;

			console.log( ("无法签到：" + (signNotSupported.length)) );
			console.log( ("签到成功：" + (signed.length + signSuccess.length)) );
			console.log( ("签到失败：" + (signFailed.length)) );
			if( signFailed.length > 0 ) {
				console.log( "签到失败的贴吧如下：" );
				console.log( signFailed.join( ',' ) );
			}
		})
		.catch(function (error) {
			console.log( error );
		});
};

module.exports = index;
