import FETCH_LIKE from './api/TIEBA_FETCH_LIKE';
import SIGN_ALL from './api/TIEBA_SIGN_ALL';

import es6promise from 'es6-promise';
es6promise.polyfill();

SIGN_ALL.on('sign-not-support', ( name, i ) => {
	console.log( `${i+1}、${name} 不支持签到` );
});
SIGN_ALL.on('sign-failed', ( name, i, reason ) => {
	console.log( `${i+1}、${name} 签到失败` );
});
SIGN_ALL.on('sign-success', ( name, i, point ) => {
	console.log( `${i+1}、${name} 签到成功，经验+${point}` );
});
SIGN_ALL.on('signed', ( name, i ) => {
	console.log( `${i+1}、${name} 已签到` );
});

FETCH_LIKE().then(names => {
	console.log( `开始签到『${names.length}个贴吧』` );
	console.log( '-----------------' );
	return SIGN_ALL( names ).then(({ signNotSupported, signFailed, signed }) => {
		console.log( '-----------------' );
		console.log( `无法签到：${signNotSupported.length}` );
		console.log( `签到成功：${signed.length}` );
		console.log( `签到失败：${signFailed.length}` );
		if( signFailed.length > 0 ) {
			console.log( '-----------------' );
			console.log( `签到失败的贴吧如下：` );
			console.log( signFailed.join(' - ') );
		}
	});
});
