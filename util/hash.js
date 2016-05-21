import crypto from 'crypto';

let hash = content => {
	let h = crypto.createHash( 'md5' );
	h.update( content );
	return h.digest( 'hex' );
};

export default hash;
