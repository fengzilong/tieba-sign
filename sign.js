import request from 'request';
import jar from './jar';
import md5 from './md5';
import signStatus from './signStatus';

const encode = data => {
	let SIGN_KEY = "tiebaclient!!!";
	let s = "";
	for( let i in data ) {
		s += i + '=' + data[i];
	}
	let sign = md5( decodeURIComponent( s ) + SIGN_KEY );
	let result = '';
	for( let i in data ) {
		result += '&' + i + '=' + data[i];
	}
	result += '&sign=' + sign;
	return result.replace( '&', '' );
};

let sign = names => {
	const url = `http://c.tieba.baidu.com/c/c/forum/sign`;
	let i = 0;

	let notSupported = [];
	let signed = [];
	let signFailed = [];

	let signOne = () => {
		return new Promise(( resolve, reject ) => {
			if( names.length > 0 ) {
				return signStatus( names[ i ] ).then(({ status, fid, tbs }) => {
					setTimeout(() => {
						switch( status ) {
							case -1:
								console.log( `${i}、${names[ i ]} 未开启签到功能` );
								notSupported.push( names[ i ] );
								resolve({ notSupported, signFailed, signed });
								break;
							case 0:
								let data = {
									"_client_id" : "03-00-DA-59-05-00-72-96-06-00-01-00-04-00-4C-43-01-00-34-F4-02-00-BC-25-09-00-4E-36",
									"_client_type" : "4",
									"_client_version" : "1.2.1.17",
									"_phone_imei" : "540b43b59d21b7a4824e1fd31b08e9a6",
									"fid" : fid,
									"kw" : encodeURIComponent( names[ i ] ),
									"net_type" : "3",
									"tbs" : tbs
								};

								request({ method: 'POST', url, jar, encoding: 'binary', form: encode( data ) }, ( error, response, body ) => {
									let json = JSON.parse( body );

									if( json.error_code === '0' ) {
										console.log( `${i}、${names[ i ]} 签到成功，经验+${json.user_info.sign_bonus_point}` );
										signed.push( names[ i ] );
									} else {
										console.log( `${i}、${names[ i ]} 签到失败` );
										signFailed.push( names[ i ] );
									}

									resolve({ notSupported, signFailed, signed });
								});
								break;
							case 1:
								console.log( `${i}、${names[ i ]} 已签到` );
								signed.push( names[ i ] );
								resolve({ notSupported, signFailed, signed });
								break;
						}
					}, 638);
				});
			} else {
				console.log( '未关注任何贴吧' );
				resolve({ notSupported, signFailed, signed });
			}
		}).then(({ notSupported, signFailed, signed }) => {
			i++;

			if( i < names.length ) {
				return signOne();
			} else {
				return Promise.resolve( { notSupported, signFailed, signed } );
			}
		});
	};

	return signOne;
};

export default sign;
