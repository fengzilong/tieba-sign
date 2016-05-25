import fs from 'fs';
import path from 'path';
import program from 'commander';
import date from './util/date';
import { SIGN_CONF_PATH } from './config';

const load = ( p, d ) => {
	let ret;
	if( fs.existsSync( p ) ) {
		ret = fs.readFileSync( p, 'utf-8' );
		try {
			ret = JSON.parse( ret );
		} catch( e ) {
		}
	}
	return ret || d;
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

// program
// 	.command( 'cookie <cookie>' )
// 	.action(cookie => {
// 		// valid username of cookie
//
// 	});

program.parse( process.argv );

require( './index.es6' );
