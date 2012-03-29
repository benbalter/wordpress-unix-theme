<?php 

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
	wp_enqueue_script( 'cli', get_template_directory_uri() . '/js/cli.js', array( 'jquery' ), wp_unix_version(), true );
	wp_enqueue_script( 'wp_unix', get_template_directory_uri() . '/js/wp-unix.js', array( 'cli', 'jquery' ), wp_unix_version(), true );
	
}

add_action ( 'wp_enqueue_scripts', 'wp_unix_enqueue' );

/**
 * Output i18n info to browser
 */
function wp_unix_i18n() {
	
	global $current_user;
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
		'welcome_message' => "********************\n* Welcome to " . get_bloginfo( 'title' ) . " *\n********************\n",
		'error' => __( 'An error occurred', 'wp-unix' ),
		'invalid_post' => __( 'Invalid post', 'wp-unix' ),
		'bad_command' => __( 'Unrecognized command. Type "help" for assistance.', 'wp-unix' ),
		'help' => __( 'help', 'wp-unix' ),
		'post_usage' => __( 'Usage: post [postID]', 'wp-unix' ),
	);
	
	wp_localize_script( 'cli', 'wp_unix_i18n', $data );

}

add_action( 'wp_enqueue_scripts', 'wp_unix_i18n' );