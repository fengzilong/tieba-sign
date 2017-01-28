const ora = require( 'ora' );
const chalk = require( 'chalk' );
const event = require( './event' );

const logger = {
	log: function ( message, label ) {
		console.log( ' ' + label + ' ' + message.trim() + '\n' );
	},
	success: function ( message, label ) {
		this.log( message, chalk.bgGreen.black( label ? ' ' + label + ' ' : ' SUCCESS ' ) );
	},
	error: function ( message, label ) {
		this.log( message, chalk.bgRed.black( label ? ' ' + label + ' ' : '  ERROR  ' ) );
	},
	warn: function ( message, label ) {
		this.log( message, chalk.bgYellow.black( label ? ' ' + label + ' ' : ' WARNING ' ) );
	},
}

module.exports = function () {
	const spinner = ora( {
		spinner: {
			interval: 100,
			frames: [ '' ],
		},
		color: 'white'
	} );

	/* getlikes START */
	event.on( 'getlikes:start', function ( data ) {
		spinner.start();
		spinner.text = '获取喜欢的贴吧列表 ' + data.current + '/' + data.total + '页';
		spinner.render();
	} );
	event.on( 'getlikes:process', function ( data ) {
		spinner.text = '获取喜欢的贴吧列表 ' + data.current + '/' + data.total + '页';
		spinner.render();
	} );
	event.on( 'getlikes:error', function ( error ) {
		spinner.stop();
		console.log( 'getlikes:error', error );
	} );
	event.on( 'getlikes:stop', function ( likes ) {
		spinner.stop();
		console.log( '开始签到 ' + likes.length + ' 个贴吧\n' );
	} );
	/* getlikes END */

	/* sign START */
	const count = {
		success: 0,
		alreadySigned: 0,
		failed: 0,
		notSupported: 0,
	};
	event.on( 'sign:success', function ( data ) {
		logger.success( data.name + '吧，签到成功，经验 +' + data.point );
		count.success++;
	} );
	event.on( 'sign:already-signed', function ( data ) {
		logger.success( data.name + '吧，已签到' );
		count.alreadySigned++;
	} );
	event.on( 'sign:failed', function ( data ) {
		logger.error( data.name + '吧，签到失败' );
		count.failed++;
	} );
	event.on( 'sign:not-support', function ( data ) {
		logger.warn( data.name + '吧，不支持签到' );
		count.notSupported++;
	} );

	const startTime = Date.now();
	event.on( 'sign:end', function ( data ) {
		console.log( ' 本次签到耗时：' + ( Date.now() - startTime ) / 1000 + 's' );
		console.log( ' 签到成功/已签到：' + ( count.success + count.alreadySigned ) );
		console.log( ' 不支持签到：' + count.notSupported );
		console.log( ' 签到失败：' + count.failed );
	} );
	/* sign END */
}
