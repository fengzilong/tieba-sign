import request from 'request';
import jar from '../jar';

function signStatus ( kw ) {
	const url = `http://tieba.baidu.com/mo/m?kw=${kw}`;
	const headers = {
		"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
		"User-Agent" : "Mozilla/5.0 (SymbianOS/9.3; Series60/3.2 NokiaE72-1/021.021; Profile/MIDP-2.1 Configuration/CLDC-1.1 ) AppleWebKit/525 (KHTML, like Gecko) Version/3.0 BrowserNG/7.1.16352"
	};

	return new Promise(( resolve, reject ) => {
		request({ url, jar, encoding: 'utf-8', headers}, ( error, response, body ) => {
			let rightPart = body.match( /<td[ ]style="text-align:right;".*?<\/td>/ );

			if(
				!rightPart ||
				rightPart[ 0 ] === '<td style="text-align:right;"></td>'
			) {
				resolve({ status: -1, fid: '', tbs: '' });
			} else {
				if( rightPart[ 0 ].indexOf( '已签到' ) !== -1 ) {
					resolve({ status: 1, fid: '', tbs: '' });
				} else {
					let fid = rightPart[0].match(/fid=(\d+)/)[1];
					let tbs = rightPart[0].match(/tbs=([0-9a-f]{26})/)[1];
					resolve({ status: 0, fid, tbs });
				}
			}
		});
	});
}

export default signStatus;
