var cli_query = {};

function add_query_arg(key, value) {
    url = document.location.href;
    
    if ( url.indexOf( '?' ) < 0 )
    	url = url + '?';

	url = url + key + '=' + value;
	    
 	return url;
}

function displayPost( data, terminal ) {
	
	Terminal.setWorking(false);

	if ( data.status != "ok" ) {
		Terminal.print( $('<p>').addClass('error').text( "Invalid Post" ) );
		return;
	}
		
	Terminal.print( $('<h3>').text( data.post.title ) );
	Terminal.print( $( data.post.content ) );
	
}

$('#screen').bind('cli-load', function() {

	Terminal.setWorking(true);
	
	//get JSON representation of current query
	$.getJSON( add_query_arg( 'json', 1 ), function(data){ 
		Terminal.setWorking(false);
		cli_query = data 
		if ( data.status != "ok" ) {
			Terminal.print( $('<p>').addClass('error').text( "An error occured" ) );
			return
		}
		if ( data.post != undefined ) {
			displayPost( data );
			Terminal.setWorking(false);
		}
	});
});

TerminalShell.commands['list'] = function( terminal ) {
	$(cli_query.posts).each( function( i, post ) {
		terminal.print( post.id + '. ' + post.title );
	});
}

TerminalShell.commands['post'] = function( terminal ) {

	var postID = Array.prototype.slice.call(arguments);
	postID.shift();
	url = cli_data.home + '/?json=get_post&post_id=' + postID;

	if ( postID.length != 1 ) {
		terminal.print( $('<p>').addClass('error').text( "usage: post [postID]" ) );
	} else {
		Terminal.setWorking(true);
		$.getJSON( url, function(data){ displayPost( data, terminal ); });
	}
}