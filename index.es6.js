import es6promise from 'es6-promise';
import fetchLike from './fetchLike';
import sign from './sign';

es6promise.polyfill();

fetchLike().then(( { names, links } ) => {
	console.log( `开始签到『${names.length}个贴吧』` );
	console.log( '-----------------' );
	sign( names )().then(({ notSupported, signFailed, signed }) => {
		console.log( '-----------------' );
		// console.log( notSupported, signFailed, signed );
		console.log( `无法签到：${notSupported.length}` );
		console.log( `签到成功：${signed.length}` );
		console.log( `签到失败：${signFailed.length}` );
		if( signFailed.length > 0 ) {
			console.log( '-----------------' );
			console.log( `签到失败的贴吧如下：` );
			console.log( signFailed.join(' - ') );
		}
	});
});
