import request from '../request';
import md5 from '../util/md5';
import SIGN_STATUS from './TIEBA_SIGN_STATUS';

// sign status
const SIGN_NOT_SUPPORT = -2;
const SIGN_FAIL = -1;
const SIGN_SUCCESS = 0;
const SIGNED = 1;
// sign interval
const SIGN_INTERVAL = 638;
// others
const url = `http://c.tieba.baidu.com/c/c/forum/sign`;
const encode = data => {
	const SIGN_KEY = "tiebaclient!!!";
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

const signOne = name => {
	return new Promise(( resolve, reject ) => {
		return SIGN_STATUS( name ).then(({ status, fid, tbs }) => {
			setTimeout(() => {
				switch( status ) {
					case -1:
						resolve({
							status: SIGN_NOT_SUPPORT,
							data: {},
							message: '',
						});
						break;
					case 0:
						let data = {
							"_client_id" : "03-00-DA-59-05-00-72-96-06-00-01-00-04-00-4C-43-01-00-34-F4-02-00-BC-25-09-00-4E-36",
							"_client_type" : "4",
							"_client_version" : "1.2.1.17",
							"_phone_imei" : "540b43b59d21b7a4824e1fd31b08e9a6",
							"fid" : fid,
							"kw" : encodeURIComponent( name ),
							"net_type" : "3",
							"tbs" : tbs
						};

						request({ method: 'POST', url, encoding: 'binary', form: encode( data ) }, ( error, response, body ) => {
							let json;
							try {
								json = JSON.parse( body );
							} catch( e ) {
								json = {};
							}
							if( json.error_code === '0' ) {
								resolve({
									status: SIGN_SUCCESS,
									data: {
										point: json.user_info.sign_bonus_point,
									},
									message: ''
								});
							} else {
								// TODO: 增加失败原因
								resolve({
									status: SIGN_FAIL,
									data: {},
									message: '',
								});
							}
						});
						break;
					case 1:
						resolve({
							status: SIGNED,
							data: {},
							message: '',
						});
						break;
				}
			}, SIGN_INTERVAL);
		});
	});
};

export default signOne;
