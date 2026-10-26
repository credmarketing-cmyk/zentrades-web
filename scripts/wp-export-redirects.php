<?php
// Run with: wp eval-file scripts/wp-export-redirects.php > data/redirects.json  (from the WordPress root)
global $wpdb;
$home = untrailingslashit( home_url() );
$rows = $wpdb->get_results( "SELECT url, action_data, action_code, regex FROM {$wpdb->prefix}redirection_items WHERE status = 'enabled' AND action_type = 'url'" );
$out  = [];
foreach ( $rows as $r ) {
	$dest = str_replace( $home, '', $r->action_data );
	$out[] = [
		'source'      => rtrim( $r->url, '/' ) ?: '/',
		'destination' => $dest === '' ? '/' : $dest,
		'permanent'   => in_array( (int) $r->action_code, [ 301, 308 ], true ),
		'regex'       => (bool) $r->regex,
	];
}
echo wp_json_encode( $out, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES );
