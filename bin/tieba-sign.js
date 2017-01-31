#!/usr/bin/env node
'use strict';

const updateNotifier = require( 'update-notifier' );
const program = require( 'commander' );
const co = require( 'co' );
const pkg = require( '../package.json' );
const sign = require( '../lib' );
const cookieStore = require( './store/cookie' );
const recordsStore = require( './store/records' );

updateNotifier( { pkg: pkg } ).notify();

program
	.command( 'cookie <bduss>' )
	.action( function ( bduss ) {
		cookieStore.save( {
			bduss: bduss
		} );
		console.log( 'saved' );
	} );

program
	.command( 'clear' )
	.action( function () {
		cookieStore.clear();
		recordsStore.clear();
		console.log( 'cleared' );
	} );

if ( process.argv && process.argv.length > 2 ) {
	program.parse( process.argv );
} else {
	main();
}

function main() {
	require( './cache' )();

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
			const signed = recordsStore.load( 'signed' );
			const filtered = likes.filter( function ( like ) {
				return !~signed.indexOf( like );
			} );
			console.log( '共', likes.length, '个贴吧，已签到', signed.length, '个\n' );
			yield service.sign( filtered );
		} catch( e ) {
			throw e;
		}
	} );
}
