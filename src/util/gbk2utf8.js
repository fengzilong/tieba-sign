import iconv from 'iconv-lite';
import { Buffer } from 'buffer';

export default content => {
	return iconv.decode( new Buffer( content, 'binary' ), 'gbk' ).toString();
}
