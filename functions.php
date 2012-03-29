<?php 

function wpcli_version() {
	return 1;
}

function wpcli_json_api_check() {
	if ( !class_exists( 'JSON_API') )
		wp_die( 'Please install and activate the plugin JSON API prior to using this theme' );
}

add_action( 'plugins_loaded', 'wpcli_json_api_check' );

function wpcli_enqueue() { 
	
	//css
	wp_enqueue_style( 'boilerplate', get_template_directory_uri() . '/boilerplate.css' );
	wp_enqueue_style( 'cli', get_stylesheet_directory_uri() . '/style.css' );

	//modernizr
	wp_enqueue_script( 'modernizr', get_template_directory_uri() . '/js/modernizr-2.5.3-respond-1.1.0.min.js', wpcli_version(), true );

	//js
	wp_enqueue_script( 'jquery-hotkeys', null, array( 'jquery' ), wpcli_version(), true );
	wp_enqueue_script( 'jquery-browser', get_template_directory_uri() . '/js/jquery.browser.js', array( 'jquery' ), wpcli_version(), true );
	wp_enqueue_script( 'cli', get_template_directory_uri() . '/js/cli.js', array( 'jquery' ), wpcli_version(), true );
	wp_enqueue_script( 'wp_cli', get_template_directory_uri() . '/js/wp_cli.js', array( 'cli', 'jquery' ), wpcli_version(), true );
	
}

add_action ( 'wp_enqueue_scripts', 'wpcli_enqueue' );

function wpcli_i18n() {
	
	global $current_user;
	get_currentuserinfo();
	if ( is_user_logged_in() )
		$user = $current_user->user_nicename;
	else 
		$user = __( 'anon', 'wpcli' );
	
	$host = get_bloginfo( 'url' );
	$host = str_replace( 'http://', '', $host );

	$data = array( 
		'prompt' => "{$user}@{$host}:/$ ",
		'home' => get_bloginfo( 'home' ),
	);
	
	wp_localize_script( 'cli', 'cli_data', $data );

}

add_action( 'wp_enqueue_scripts', 'wpcli_i18n' );