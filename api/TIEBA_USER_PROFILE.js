import request from 'request';
import gbk2utf8 from '../util/gbk2utf8';
import jar from '../jar';

const url = 'http://tieba.baidu.com/f/user/json_userinfo';
export default () => new Promise(( resolve, reject ) => {
	request({
		method: 'GET',
		url,
		jar,
		encoding: 'binary',
		qs: {
			_: +new Date()
		}
	}, ( error, response, body ) => {
		body = gbk2utf8( body );
		const json = JSON.parse( body );
		if( json && json.error === '' ) {
			resolve( json.data );
		} else {
			reject( 'cookie invalid' );
		}
	})
});
