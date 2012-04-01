/*
Client-side WordPress-specific logic for cli

Benjamin J. Balter, 2012
http://unix.benbalter.com

*/

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
		
				
		//no results
		if ( data.count == 0 ) {
			Terminal.print( $('<p>').addClass('error').text( wp_unix_i18n.no_results ) );
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

	Terminal.print( '' );
	Terminal.print( post.title );
	for ( line = ''; line.length < post.title.length; line = line + "=" ) {};
	Terminal.print( line );
	
	if ( post.type != 'page' )
		Terminal.print( wp_unix_i18n.posted + $.format.date( post.date, wp_unix_i18n.date_format ) );
	
	Terminal.print( '' );
	Terminal.print( post.content );
	Terminal.print( '' );
	
	//only show meta on non-page posts
	if ( post.type != 'page' ) {
		meta = wp_unix_i18n.meta;
		meta = meta.replace( "%3$s", post.author.name ).replace( "%2$s", 	termList( post.categories ) ).replace( "%1$s", termList( post.tags ) );
	}
	
	Terminal.print( meta );
	Terminal.print( '' );
	
	//push permlink
	history.pushState({page:post.url}, post.url, post.url);
	
}

function termList( terms ) {
	
	var termList = [];
	$.each( terms, function( i, term ) {
		termList[i] = term.title;
	});
	
	return termList.join( ', ' );
	
}

function listTerms( terms ) {
	$.each( terms, function( i, term ) {
		Terminal.print( term.term_id + '. ' + term.name );
	});
	
}

//output list of posts
function listPosts( posts ) {

	$.each( posts, function( i, post ) {
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
	
	$.each( wp_unix_i18n.pages, function( i, page ) {
		TerminalShell.commands[ page.slug ] = function( terminal ) { 
			TerminalShell.process( terminal, 'page ' + page.id );
		};
	});

	//single post/page
	if ( wp_unix_i18n.query.length == 1 ) {
		post = wp_unix_i18n.query[0];
		Terminal.runCommand( post.type + " " + post.id );
	}
	
});

//display list of posts
TerminalShell.commands['posts'] = 
TerminalShell.commands['ls'] = 
TerminalShell.commands['list'] = function( terminal ) {

	//we're on an archive and this is the initial view, save the query	
	if ( wp_unix_i18n.query.length != 0 ) {
		listPosts( wp_unix_i18n.query );
		return;
	}

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
	
	if ( wp_unix_i18n.query.length == 1 && wp_unix_i18n.query[0].id == postID ) {
		post = wp_unix_i18n.query.shift();
		displayPost( post );
		return;
	}
	
	query = 'get_post&id=' + postID;
	displayQuery( query );
	
}

//display individual page
TerminalShell.commands['page'] = function( terminal ) {

	var pageID = Array.prototype.slice.call(arguments);
	pageID.shift();
	
	query = 'get_page&id=' + pageID;
	displayQuery( query );
	
}

//login or go to admin
TerminalShell.commands['su'] = function( terminal ) {
	document.location.href = wp_unix_i18n.home + '/wp-admin/';
}

//home
TerminalShell.commands['home'] = function( terminal ) {
	document.location.href = wp_unix_i18n.home;
}

//search
TerminalShell.commands['search'] = function( terminal ) {
	
	var query = Array.prototype.slice.call(arguments);
	query.shift();
	query = query.join(' ');
	
	if ( !query ) {
		Terminal.print( $('<p>').addClass('error').text( wp_unix_i18n.search_error ) );
		return;		
	}

	displayQuery( "1&s=" + query );
	
}

TerminalShell.commands['category'] = function( terminal ) {

	var categoryID = Array.prototype.slice.call(arguments);
	categoryID.shift();
	categoryID = categoryID.shift();

	displayQuery( 'get_category_posts&category_id=' + categoryID );
	
}

TerminalShell.commands['categories'] = function( terminal ) {
	listTerms( wp_unix_i18n.categories );
}

TerminalShell.commands['tags'] = function( terminal ) {
	listTerms( wp_unix_i18n.tags );
}

TerminalShell.commands['tag'] = function( terminal ) {
	
	var tagID = Array.prototype.slice.call(arguments);
	tagID.shift();
	tagID = tagID.shift();

	displayQuery( 'get_tag_posts&tag_id=' + tagID );
	
}