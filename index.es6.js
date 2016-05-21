import FETCH_LIKE from './api/TIEBA_FETCH_LIKE';
import SIGN_ALL from './api/TIEBA_SIGN_ALL';
import USER_PROFILE from './api/TIEBA_USER_PROFILE';
import { SIGN_CONF_PATH } from './config';
import getDate from './util/date';
import es6promise from 'es6-promise';
import path from 'path';
import mkdirp from 'mkdirp';
import fs from 'fs';
es6promise.polyfill();

const cwd = process.cwd();

let username;
let date;
let folder;

/*
fs.writeFileSync( path.resolve( folder, 'failed.json' ), JSON.stringify( signFailed, 0, 4 ) );
fs.writeFileSync( path.resolve( folder, 'not-support.json' ), JSON.stringify( signNotSupported, 0, 4 ) );
fs.writeFileSync( path.resolve( folder, 'signed.json' ), JSON.stringify( signed.concat( signSuccess ), 0, 4 ) );
*/

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

USER_PROFILE()
	.then(profile => {
		username = profile.user_name_show;
		console.log( `开始用户"${username}"的签到` );
	}, () => {
		console.log( '获取用户信息失败' );
		throw new Error( 'error occurs when get user profile' );
	})
	.then(() => {
		// 创建用户文件夹
		date = getDate();
		folder = path.resolve( SIGN_CONF_PATH, `${username}/${date}/` );

		if( !fs.existsSync( folder ) ) {
			mkdirp.sync( folder );
		}
	})
	.then(() => {
		let allPath = path.resolve( folder, 'all.json' );
		if( fs.existsSync( allPath ) ) {
			let content = fs.readFileSync( allPath, 'utf-8' );
			try {
				content = JSON.parse( content );
			} catch( e ) {
				content = [];
			}
			return Promise.resolve( content );
		} else {
			return FETCH_LIKE();
		}
	})
	.then(names => {
		// 如果贴吧列表未保存
		let allPath = path.resolve( folder, 'all.json' );
		if( !fs.existsSync( allPath ) ) {
			fs.writeFileSync( allPath, JSON.stringify( names, 0, 4 ) );
		}
		return Promise.resolve( names );
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
	})
	.catch(error => {
		console.log( error );
	});
