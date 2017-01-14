#!/usr/bin/env node
'use strict';

const fs = require( 'fs' );
const path = require( 'path' );
const updateNotifier = require( 'update-notifier' );
const program = require( 'commander' );
const co = require( 'co' );
const pkg = require( '../package.json' );
const sign = require( '../lib' );

updateNotifier( { pkg: pkg } ).notify();

const saveCookie = sign.cache.saveCookie;
const loadCookie = sign.cache.loadCookie;

program
	.command( 'cookie <bduss>' )
	.action( co.wrap( function * ( bduss ) {
		try {
			yield saveCookie( bduss );
		} catch( e ) {
			console.log( e );
		}
	} ) );

if ( process.argv && process.argv.length > 2 ) {
	program.parse( process.argv );
} else {
	main();
}

function main() {
	const Service = sign.Service;
	const service = sign.service;
	const createJar = sign.createJar;

	co( function * () {
		const cookie = yield loadCookie();
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
			const { username } = yield service.getProfile( bduss );
			console.log( '开始用户"' + username + '"的签到' );
			const likes = yield service.getlikesFast( bduss );
			yield service.sign( likes );
		} catch( e ) {
			throw e;
		}
	} );
}
