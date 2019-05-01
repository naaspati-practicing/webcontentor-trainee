const clipboard = require( 'copy-paste' ),
chalk = require( 'chalk' );

const input = clipboard.paste();

if ( !input || !input.trim() ) {
    console.log( 'no input found' );
    process.exit( 0 );
}

console.log( chalk.yellow( '---------' ) );
console.log( chalk.cyan( 'input' ) );
console.log( chalk.yellow( '----------------------------' ) );
console.log( input );
console.log( chalk.yellow( '----------------------------\n' ) );

const output = require( 'pug' ).render( input, {doctype: 'html', pretty: '    '} );

clipboard.copy( output );

console.log( chalk.yellow( '---------' ) );
console.log( chalk.cyan( 'output' ) );
console.log( chalk.yellow( '----------------------------' ) );
console.log( output );
console.log( chalk.yellow( '----------------------------\n' ) );
