#!/usr/bin/env node
'use strict';

const fs = require( 'fs' );
const path = require( 'path' );
const program = require( 'commander' );
const updateNotifier = require( 'update-notifier' );
const date = require( './date' );
const config = require( './config' );
const sign = require( './dist/tieba-sign.common' );
const pkg = require( './package.json' );

const SIGN_CONF_PATH = config.SIGN_CONF_PATH;

updateNotifier({ pkg: pkg }).notify();

const load = function( filepath, defaultValue ) {
	var ret;
	if( fs.existsSync( filepath ) ) {
		ret = fs.readFileSync( filepath, 'utf-8' );
		try {
			ret = JSON.parse( ret );
		} catch( e ) {
		}
	}
	return ret || defaultValue;
};

const loadJSON = function( p ) {
	return load( p, {} );
};

const loadArray = function( p ) {
	return load( p, [] );
};

const getFolders = function( p ) {
	const folders = fs.readdirSync( p );
	folders.forEach(function( f, i ) {
		const stat = fs.statSync( path.resolve( p, f ) );
		if( !stat.isDirectory() ) {
			folders.splice( i, 1 );
		}
	});
	return folders;
};

program
	.command( 'list' )
	.action(function() {
		const folders = getFolders( SIGN_CONF_PATH );
		folders.forEach(function( f ) {
			const allfilepath = path.resolve( SIGN_CONF_PATH, f, 'all.json' );
			const all = loadArray( allfilepath );
			console.log( f + '(' + all.length + ')' );
		});
	});

program
	.command( 'status [username]' )
	.action(function( username ) {
		if( username ) {
			const p = path.resolve( SIGN_CONF_PATH, username, 'all.json' );
			if( !fs.existsSync( p ) ) {
				console.log( '未找到该用户' );
				return;
			}

			const all = loadArray( p );
			const signed = loadArray( path.resolve( SIGN_CONF_PATH, username, date(), 'signed.json' ) );

			console.log( '共' + all.length + '个贴吧，' + signed.length + '个已签到' );
			return;
		}

		const folders = getFolders( SIGN_CONF_PATH );
		folders.forEach(function( f ) {
			const all = loadArray( path.resolve( SIGN_CONF_PATH, f, 'all.json' ) );
			const signed = loadArray( path.resolve( SIGN_CONF_PATH, f, date(), 'signed.json' ) );

			console.log( f + ': 共' + all.length + '个贴吧，' + signed.length + '个已签到' );
		});
	});

// program
// 	.command( 'update <username>' )
// 	.action(username => {
//
// 	});

program
	.command( 'cookie <bduss>' )
	.action( function( cookie ) {
		// TODO: valid username of cookie
		console.log( cookie );
		const COOKIE_PATH = path.resolve( SIGN_CONF_PATH, '.cookie' );
		fs.writeFileSync( COOKIE_PATH, cookie, 'utf-8' );
	} );

if( process.argv && process.argv.length > 2 ) {
	program.parse( process.argv );
} else {
	sign( {
		root: SIGN_CONF_PATH,
		folder: date(),
	} );
}
