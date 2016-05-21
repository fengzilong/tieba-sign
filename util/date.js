const repeat = ( char, count ) => {
	char = char + '';
	return new Array( count + 1 ).join( char );
};

const padZero = ( str, count ) => {
	str = str + '';
	if( str.length < count ) {
		str = repeat( '0', count - str.length ) + str;
	}
	return str;
};

export default () => {
	let t = new Date();
	let y = t.getFullYear() + '';
	let m = padZero( t.getMonth() + 1, 2 );
	let d = padZero( t.getDate(), 2 );
	return `${y}-${m}-${d}`;
};
