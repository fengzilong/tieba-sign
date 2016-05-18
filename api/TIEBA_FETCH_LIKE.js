import request from 'request';
import gbk2utf8 from '../util/gbk2utf8';
import spin from '../util/spin';
import jar from '../jar';

const MAX_SIGN_COUNT = 9999;

let names = [];
let totalNum;
let pageNum = 1;

function fetchLikeOne() {
	if( !spin.isStarted ) {
		spin.start();
	}

	let v = +new Date() - 600000;
	let url = `http://tieba.baidu.com/f/like/mylike?v=${v}&pn=${pageNum}`;

	return new Promise(( resolve, reject ) => {
		setTimeout(() => {
			request({ url, jar, encoding: 'binary' }, ( error, response, body ) => {
				body = gbk2utf8( body );
				body = body.replace(/[	]/g, '')
					.replace(/<td>\r\n/g, '<td>')
					.replace(/\r\n<\/td>/g, '</td>')
					.replace(/<span.*?span>\r\n/g, '');

				let matched = body.match(/<a[ ]href=".*?(?=<\/a><\/td>)/g);

				if( matched ) {
					for(
						let i = 0; i < matched.length && names.length < MAX_SIGN_COUNT; i++
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
			})
		}, 1000);
	}).then(( ...args ) => {
		const content = `获取喜欢的贴吧列表 ${pageNum}/${totalNum}页`;
		spin( content );
		// 判断是否存在下一页
		if( pageNum < totalNum ) {
			pageNum++;
			return fetchLikeOne();
		} else {
			spin.stop();
			console.log( content );
			return Promise.resolve( ...args );
		}
	});
}

export default fetchLikeOne;
