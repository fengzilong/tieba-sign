import request from 'request';
import fs from 'fs';
import path from 'path';
import { SIGN_CONF_PATH } from './config';

const jar = request.jar();

export default () => {
	const COOKIE_PATH = path.resolve( SIGN_CONF_PATH, '.cookie' );

	if( fs.existsSync( COOKIE_PATH ) ) {
		const bduss = fs.readFileSync( COOKIE_PATH, 'utf-8' );
		const c = `BDUSS=${bduss}`;
		const c1 = request.cookie( c );
		const c2 = request.cookie( c );
		const c3 = request.cookie( `novel_client_guide=1` )

		jar.setCookie( c1, `http://tieba.baidu.com` );
		jar.setCookie( c2, `http://c.tieba.baidu.com` );
		jar.setCookie( c3, `http://tieba.baidu.com` );
	} else {
		console.log( '请先设置cookie\nCommand: tieba-sign cookie <your cookie>' );
		process.exit();
	}
	return jar;
};
