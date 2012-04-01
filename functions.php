<?php 

//init markdownify
require_once( dirname( __FILE__ ) . '/markdownify/markdownify.php' );
$markdownify = new Markdownify( null, null, false ); //last arg: don't output unparsable HTML

/**
 * Returns current version of theme
 * @return int the current version number
 */
function wp_unix_version() {
	return 1;
}

/**
 * Verifies JSON_API is installed and active
 */
function wp_unix_json_api_check() {
	if ( !class_exists( 'JSON_API') )
		wp_die( 'Please install and activate the plugin JSON API prior to using this theme' );
}

add_action( 'plugins_loaded', 'wp_unix_json_api_check' );

/**
 * Enqueue Javascripts
 */
function wp_unix_enqueue() { 
	
	//css
	wp_enqueue_style( 'boilerplate', get_template_directory_uri() . '/boilerplate.css' );
	wp_enqueue_style( 'cli', get_stylesheet_directory_uri() . '/style.css' );

	//modernizr
	wp_enqueue_script( 'modernizr', get_template_directory_uri() . '/js/modernizr-2.5.3-respond-1.1.0.min.js', wp_unix_version(), true );

	//js
	wp_enqueue_script( 'jquery-hotkeys', null, array( 'jquery' ), wp_unix_version(), true );
	wp_enqueue_script( 'jquery-browser', get_template_directory_uri() . '/js/jquery.browser.js', array( 'jquery' ), wp_unix_version(), true );
	wp_enqueue_script( 'jquery-dateformat', get_template_directory_uri() . '/js/jquery.dateformat.js', array( 'jquery' ), wp_unix_version(), true );

	wp_enqueue_script( 'cli', get_template_directory_uri() . '/js/cli.js', array( 'jquery' ), wp_unix_version(), true );
	wp_enqueue_script( 'wp_unix', get_template_directory_uri() . '/js/wp-unix.js', array( 'cli', 'jquery' ), wp_unix_version(), true );
	
}

add_action ( 'wp_enqueue_scripts', 'wp_unix_enqueue' );

/**
 * Returns welcome message 
 * @TODO make this an option
 */
function wp_unix_welcome_message() {
	
	$msg = '';
	$title = get_bloginfo('title');
	$subtitle = get_bloginfo( 'description' );
	$len = ( strlen( $title ) > strlen( $subtitle ) ) ? strlen( $title ) : strlen( $subtitle );
	
	$title = wp_unix_center_string( $title, $len );
	$subtitle = wp_unix_center_string( $subtitle, $len );
	$len = $len + 4;
	
	$msg .= str_pad( '', $len, '*' ) . "\n";
	$msg .= "* $title *\n";
	$msg .= "* $subtitle *\n";
	$msg .= str_pad( '', $len, '*' ) . "\n";		
	return $msg;

}

/**
 * Given a string, centers it with spaces to a given length
 * @param string $str the input string
 * @param int $len the string length
 * @return string the centered string
 */
function wp_unix_center_string( $str, $len ) {
	
	if ( strlen( $str ) == $len )
		return $str;
	
	//calc diff and halve
	$len = $len - strlen( $str );
	$len = floor( $len / 2 );
	
	//pad
	$str = str_pad( ' ', $len, ' ' ) . $str . str_pad( ' ', $len, ' ' );
	
	//check if rounded down
	if ( strlen( $str ) < $len ) $str .= ' ';
	
	return $str;
	
}

/**
 * Output i18n info to browser
 */
function wp_unix_i18n() {
	
	global $current_user;
	global $json_api;
	require_once( $json_api->controller_path( 'core' ) );
	$pages = JSON_API_Core_Controller::get_page_index();
	$pages = $pages['pages'];
	
	get_currentuserinfo();
	if ( is_user_logged_in() )
		$user = $current_user->user_nicename;
	else 
		$user = __( 'anon', 'wp_unix' );
	
	$host = get_bloginfo( 'url' );
	$host = str_replace( 'http://', '', $host );
	
	$data = array( 
		'prompt' => "{$user}@{$host}:/$ ",
		'home' => get_bloginfo( 'home' ),
		'welcome_message' => wp_unix_welcome_message(),
		'error' => __( 'An error occurred', 'wp-unix' ),
		'invalid_post' => __( 'Invalid post', 'wp-unix' ),
		'bad_command' => __( 'Unrecognized command. Type "help" for assistance.', 'wp-unix' ),
		'help' => __( 'help', 'wp-unix' ),
		'post_usage' => __( 'Usage: post [postID]', 'wp-unix' ),
		'posted' => 'Posted on ',
		'date_format' => 'MMMM dd, yyyy',
		'meta' => __( 'This entry was posted in %1$s and tagged %2$s by %3$s.', 'wp-unix' ),
		'search_error' => __( 'Usage: search [search term(s)]', 'wp-unix' ),
		'no_results' => __( 'No posts found' , 'wp-unix' ),
		'query' => $json_api->introspector->get_posts(),
		'tags' => get_terms( 'post_tag' ),
		'categories' => get_terms( 'category' ),
		'pages' => $pages,
	);

	wp_localize_script( 'cli', 'wp_unix_i18n', $data );

}

add_action( 'wp_enqueue_scripts', 'wp_unix_i18n' );


function wp_unix_markdownify( $content ) {
	global $markdownify;
	$content = do_shortcode( $content );
	$content = $markdownify->parseString( $content );
	return $content;
}


add_filter( 'the_content', 'wp_unix_markdownify', 100, 1 );
remove_filter('the_content', 'sharing_display', 19);

