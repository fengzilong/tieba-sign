import SIGN_ONE from './TIEBA_SIGN_ONE';
import observable from 'riot-observable';

// sign status
const SIGN_NOT_SUPPORT = -2;
const SIGN_FAIL = -1;
const SIGN_SUCCESS = 0;
const SIGNED = 1;

let sign = names => {
	let i = 0;
	let signed = [];
	let signFailed = [];
	let signSuccess = [];
	let signNotSupported = [];

	if( !Array.isArray( names ) ) {
		return Promise.reject( 'need pass an array as param' );
	}

	if( names.length === 0 ) {
		throw new Error( '无待签到贴吧' );
	}

	function signNext( name ) {
		return SIGN_ONE( name )
			.then(({ status, data, message }) => {
				// 收集
				switch( status ) {
					case SIGN_NOT_SUPPORT:
						sign.trigger( 'sign-not-support', name, i );
						signNotSupported.push( name );
						break;
					case SIGN_FAIL:
						sign.trigger( 'sign-failed', name, i );
						signFailed.push( name );
						break;
					case SIGN_SUCCESS:
						sign.trigger( 'sign-success', name, i, data.point );
						signSuccess.push( name );
						break;
					case SIGNED:
						sign.trigger( 'signed', name, i, message );
						signed.push( name );
						break;
				}

				if( i < names.length - 1 ) {
					i++;
					return signNext( names[ i ] );
				} else {
					return Promise.resolve({ signNotSupported, signFailed, signSuccess, signed });
				}
			});
	}

	return signNext( names[ 0 ] );
};

observable( sign );

export default sign;
