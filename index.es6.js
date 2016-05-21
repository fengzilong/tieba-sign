import FETCH_LIKE from './api/TIEBA_FETCH_LIKE';
import SIGN_ALL from './api/TIEBA_SIGN_ALL';
import USER_PROFILE from './api/TIEBA_USER_PROFILE';
import { SIGN_CONF_PATH } from './config';
import date from './util/date';
import es6promise from 'es6-promise';
import fs from 'fs';
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

let username;
USER_PROFILE()
	.then(profile => {
		username = profile.user_name_show;
		console.log( `开始用户"${username}"的签到` );
	}, () => {
		return Promise.reject();
	})
	.then(() => FETCH_LIKE(), () => {
		console.log( '获取用户信息失败' );
	})
	.then(names => {
		if( names.length > 0 ) {
			console.log( `开始签到『${names.length}个贴吧』` );
		} else {
			console.log( '未关注任何贴吧' );
		}
		return names;
	})
	.then(names => SIGN_ALL( names ))
	.then(({ signNotSupported, signFailed, signSuccess, signed }) => {
		console.log( `无法签到：${signNotSupported.length}` );
		console.log( `签到成功：${signed.length + signSuccess.length}` );
		console.log( `签到失败：${signFailed.length}` );
		if( signFailed.length > 0 ) {
			console.log( `签到失败的贴吧如下：` );
			console.log( signFailed.join( ',' ) );
		}
	});
