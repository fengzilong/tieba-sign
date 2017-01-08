#!/usr/bin/env node
'use strict';

const fs = require( 'fs' );
const path = require( 'path' );
const updateNotifier = require( 'update-notifier' );
const program = require( 'commander' );
const co = require( 'co' );
const pkg = require( '../package.json' );
const sign = require( '../lib' );

const Service = sign.Service;
const service = sign.service;
const createJar = sign.createJar;

const bduss = '';

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
	[
		'BDUSS=' + bduss,
		'http://c.tieba.baidu.com'
	]
] ) );

updateNotifier( { pkg: pkg } ).notify();

co( function * () {
	try {
		const likes = yield service.getlikes();
		yield service.sign( likes );
	} catch( e ) {
		throw e;
	}
} );
