import fs from 'fs';
import path from 'path';
import program from 'commander';
import updateNotifier from 'update-notifier';
import date from './util/date';
import { SIGN_CONF_PATH } from './config';
import sign from './index.es6';
import pkg from './package.json';

updateNotifier({ pkg }).notify();

const load = ( filepath, defaultValue ) => {
	let ret;
	if( fs.existsSync( filepath ) ) {
		ret = fs.readFileSync( filepath, 'utf-8' );
		try {
			ret = JSON.parse( ret );
		} catch( e ) {
		}
	}
	return ret || defaultValue;
};

const loadJSON = p => {
	return load( p, {} );
};

const loadArray = p => {
	return load( p, [] );
};

const getFolders = p => {
	let folders = fs.readdirSync( p );
	folders.forEach(( f, i ) => {
		let stat = fs.statSync( path.resolve( p, f ) );
		if( !stat.isDirectory() ) {
			folders.splice( i, 1 );
		}
	});
	return folders;
};

program
	.command( 'list' )
	.action(() => {
		let folders = getFolders( SIGN_CONF_PATH );
		folders.forEach(f => {
			let allfilepath = path.resolve( SIGN_CONF_PATH, f, 'all.json' );
			let all = loadArray( allfilepath );
			console.log( `${f}(${all.length})` );
		});
	});

program
	.command( 'status [username]' )
	.action(username => {
		if( username ) {
			let p = path.resolve( SIGN_CONF_PATH, username, 'all.json' );
			if( !fs.existsSync( p ) ) {
				console.log( '未找到该用户' );
				return;
			}

			let all = loadArray( p );
			let signed = loadArray( path.resolve( SIGN_CONF_PATH, username, date(), 'signed.json' ) );

			console.log( `共${all.length}个贴吧，${signed.length}个已签到` );
			return;
		}

		let folders = getFolders( SIGN_CONF_PATH );
		folders.forEach(f => {
			let all = loadArray( path.resolve( SIGN_CONF_PATH, f, 'all.json' ) );
			let signed = loadArray( path.resolve( SIGN_CONF_PATH, f, date(), 'signed.json' ) );

			console.log( `${f}: 共${all.length}个贴吧，${signed.length}个已签到` );
		});
	});

// program
// 	.command( 'update <username>' )
// 	.action(username => {
//
// 	});

program
	.command( 'cookie <bduss>' )
	.action(cookie => {
		// TODO: valid username of cookie
		console.log( cookie );
		const COOKIE_PATH = path.resolve( SIGN_CONF_PATH, '.cookie' );
		fs.writeFileSync( COOKIE_PATH, cookie, 'utf-8' );
	});

if( process.argv && process.argv.length > 2 ) {
	program.parse( process.argv );
} else {
	sign();
}
