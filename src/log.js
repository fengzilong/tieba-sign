import chalk from 'chalk';

function log( message, label ) {
	console.log( `${ label } ${ message.trim() }` )
}

export default {
	success( message, label ) {
		log( message, chalk.bgGreen.black( label ? ` ${ label } ` : ' SUCCESS ' ) );
	},
	error( message, label ) {
		log( message, chalk.bgRed.black( label ? ` ${ label } ` : ' ERROR ' ) );
	},
}
