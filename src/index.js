import es6promise from 'es6-promise';
import mkdirp from 'mkdirp';
import path from 'path';
import fs from 'fs';
import SKIP_AD from './api/SKIP_AD';
import USER_PROFILE from './api/USER_PROFILE';
import FETCH_LIKE from './api/FETCH_LIKE';
import SIGN_ALL from './api/SIGN_ALL';
import log from './log';

es6promise.polyfill();

let username;
let userfolder;
let folder;

const save = ( p, v ) => {
	if( fs.existsSync( p ) ) {
		let arr = fs.readFileSync( p, 'utf-8' );
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
const load = p => {
	let arr = [];
	if( fs.existsSync( p ) ) {
		let content = fs.readFileSync( p, 'utf-8' );
		try {
			arr = JSON.parse( content );
		} catch( e ) {
			arr = [];
		}
	}

	return arr;
};

SIGN_ALL.on('sign-not-support', ( name, i ) => {
	log.error( `${name} 不支持签到` );
	save( path.resolve( folder, 'not-support.json' ), name );
});
SIGN_ALL.on('sign-failed', ( name, i, reason ) => {
	log.error( `${name} 签到失败` );
});
SIGN_ALL.on('sign-success', ( name, i, point ) => {
	log.success( `${name} 签到成功，经验+${point}` );
	save( path.resolve( folder, 'signed.json' ), name );
});
SIGN_ALL.on('signed', ( name, i ) => {
	log.success( `${name} 已签到` );
	save( path.resolve( folder, 'signed.json' ), name );
});

function clearConsole() {
	process.stdout.write( '\x1bc' );
	return Promise.resolve();
}

export default ( { root, folder: folderName } ) => {
	clearConsole()
		.then( SKIP_AD )
		.then( USER_PROFILE )
		.then( profile => {
			username = profile.user_name_show;
			console.log( `开始用户"${username}"的签到` );
		} )
		.then(() => {
			// 创建用户文件夹
			userfolder = path.resolve( root, `${username}/` );
			folder = path.resolve( root, `${username}/${folderName}/` );

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
		.then(() => {
			let allPath = path.resolve( userfolder, 'all.json' );
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
			let allPath = path.resolve( userfolder, 'all.json' );
			if( !fs.existsSync( allPath ) ) {
				fs.writeFileSync( allPath, JSON.stringify( names, 0, 4 ) );
			}
			return Promise.resolve( names );
		})
		.then(names => {
			// 过滤不支持 && 已签到的贴吧
			let signed = load( path.resolve( folder, 'signed.json' ) );
			let notSupport = load( path.resolve( folder, 'not-support.json' ) );
			let exclude = signed.concat( notSupport );
			let filtered = [];
			for( let i = 0, len = names.length; i < len; i++ ) {
				if( !~exclude.indexOf( names[ i ] ) ) {
					filtered.push( names[ i ] );
				}
			}
			return Promise.resolve({
				all: names,
				filtered,
				signed,
				notSupport,
			});
		})
		.then(({ all, filtered, signed, notSupport }) => {
			if( all.length > 0 ) {
				console.log( `已签到『${signed.length}个贴吧』` );
				console.log( `无法签到『${notSupport.length}个贴吧』` );
				console.log( `开始签到『${filtered.length}个贴吧』` );
			} else {
				console.log( '未关注任何贴吧' );
			}
			return filtered;
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
};
