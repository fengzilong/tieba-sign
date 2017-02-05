#!/usr/bin/env node
'use strict';

const updateNotifier = require( 'update-notifier' );
const yargs = require( 'yargs' );
const co = require( 'co' );
const pkg = require( '../package.json' );
const sign = require( '../lib' );
const cookieStore = require( './store/cookie' );
const recordsStore = require( './store/records' );

updateNotifier( { pkg: pkg } ).notify();

const argv = yargs
	.alias( 's', 'skipCache' )
	.command( 'cookie', 'store cookie locally' )
	.command( 'clear', 'clear stored data' )
	.argv;

const handlers = {
	cookie: function ( argv ) {
		const bduss = argv._[ 1 ];
		cookieStore.save( {
			bduss: bduss
		} );
		console.log( 'saved' );
	},
	clear: function () {
		cookieStore.clear();
		recordsStore.clear();
		console.log( 'cleared' );
	}
}

const commandName = argv._[ 0 ];
const handler = handlers[ commandName ];

// if command matched
if ( typeof handler === 'function' ) {
	handler( argv );
} else {
	main( {
		skipCache: !!argv.skipCache
	} );
}

function main( options ) {
	require( './cache' )();

	options = options || {};
	const skipCache = options.skipCache;

	const Service = sign.Service;
	const service = sign.service;
	const createJar = sign.createJar;

	co( function * () {
		const cookie = cookieStore.load();
		const bduss = cookie.bduss;

		// setup Service
		Service.jar( createJar( [
			[
				'BDUSS=' + bduss,
				'http://tieba.baidu.com'
			],
			[
				'novel_client_guide=1',
				'http://tieba.baidu.com'
			],
		] ) );

		try {
			yield service.skipAd();

			const profile = yield service.getProfile( bduss );
			const username = profile.username;
			if ( username ) {
				console.log( '开始用户 ' + username + ' 的签到' );
			} else {
				console.log( '开始签到' );
			}

			const likes = ( yield service.getlikesFast( bduss ) ) || [];
			const signed = skipCache ? [] : recordsStore.load( 'signed' );
			const filtered = skipCache ? likes : likes.filter( function ( like ) {
				return !~signed.indexOf( like );
			} );
			console.log( '共', likes.length, '个贴吧，已签到', signed.length, '个\n' );
			yield service.sign( filtered );
		} catch( e ) {
			throw e;
		}
	} );
}
