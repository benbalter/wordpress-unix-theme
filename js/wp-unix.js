//global query object
var cli_query = {};

//add query arg to current URL
function add_query_arg(key, value) {
    url = document.location.href;
    
    if ( url.indexOf( '?' ) < 0 )
    	url = url + '?';

	url = url + key + '=' + value;
	    
 	return url;
}

function displayQuery( query ) {

	Terminal.setWorking( true );

	$.getJSON( wp_unix_i18n.home + '/?json=' + query, function( data ) {
	
		Terminal.setWorking( false );

		//data error
		if ( data.status != 'ok' ) {
			Terminal.print( $('<p>').addClass('error').text( wp_unix_i18n.error ) );
			return;
		}
		
		//single post -- output
		if ( data.post != undefined ) {
			displayPost( data.post );
		}

		//single page -- output
		if ( data.page != undefined ) {
			displayPost( data.page );
		}
		
		//multiple posts -- list
		if ( data.posts != undefined ) {
			listPosts( data.posts );
		}

		//page index -- list
		//@TODO heirarchical
		if ( data.pages != undefined ) {
			listPosts( data.pages );
		}
	
	});	
}

//output an individual post
function displayPost( post  ) {
			
	Terminal.print( $('<h3>').text( post.title ) );
	Terminal.print( $( post.content ) );
	
}

//output list of posts
function listPosts( posts ) {

	$( posts ).each( function( i, post ) {
		Terminal.print( post.id + '. ' + post.title );
	});

}

//output welcome message
function welcomeMessage() {

	Terminal.print( wp_unix_i18n.welcome_message );

}

//init
$('#screen').bind('cli-load', function() {
	
	welcomeMessage();
	
});

//display list of posts
TerminalShell.commands['posts'] = 
TerminalShell.commands['ls'] = 
TerminalShell.commands['list'] = function( terminal ) {
	displayQuery( 'get_recent_posts' );
}

//displat list of pages
TerminalShell.commands['pages'] = function() {
	displayQuery( 'get_page_index' );
}

//display individual post
TerminalShell.commands['post'] = function( terminal ) {

	var postID = Array.prototype.slice.call(arguments);
	postID.shift();
	
	query = 'get_post&post_id=' + postID;
	displayQuery( query );
	
}

//display individual page
TerminalShell.commands['page'] = function( terminal ) {

	var pageID = Array.prototype.slice.call(arguments);
	pageID.shift();
	
	query = 'get_page&page_id=' + pageID;
	displayQuery( query );
	
}

TerminalShell.commands['sudo'] = function( terminal ) {
	document.location.href = wp_unix_i18n.home + '/wp-admin/';
}