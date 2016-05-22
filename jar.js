import request from 'request';
import fs from 'fs';

const bduss = fs.readFileSync( './.bduss', 'utf-8' );
let c = `BDUSS=${bduss}`;
let c1 = request.cookie( c );
let c2 = request.cookie( c );

let jar = request.jar();
jar.setCookie( c1, `http://tieba.baidu.com` );
jar.setCookie( c2, `http://c.tieba.baidu.com` );

export default jar;
