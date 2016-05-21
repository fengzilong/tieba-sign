import program from 'commander';

program
	.command( 'status' );

program
	.command( 'update' );

program
	.option( '-c, --cookie <cookie>', 'set your cookie', '' );

program.parse( process.argv );
