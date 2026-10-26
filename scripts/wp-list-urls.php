<?php
// Run with: wp eval-file scripts/wp-list-urls.php > urls.json  (from the WordPress root)
$home = untrailingslashit( home_url() );
$out  = [];
$add  = function ( $url, $type, $id = null ) use ( &$out, $home ) {
	$path = substr( $url, strlen( $home ) );
	$path = '/' . trim( (string) wp_parse_url( $path, PHP_URL_PATH ), '/' );
	$out[ $path ] = [ 'path' => $path, 'type' => $type, 'id' => $id, 'modified' => $id ? get_post_modified_time( 'c', true, $id ) : null ];
};

$add( home_url( '/' ), 'home', (int) get_option( 'page_on_front' ) ?: null );

foreach ( [ 'page', 'post' ] as $pt ) {
	$ids = get_posts( [ 'post_type' => $pt, 'post_status' => 'publish', 'numberposts' => -1, 'fields' => 'ids', 'suppress_filters' => false ] );
	foreach ( $ids as $id ) {
		$add( get_permalink( $id ), $pt, $id );
	}
}

foreach ( [ 'category', 'post_tag' ] as $tax ) {
	foreach ( get_terms( [ 'taxonomy' => $tax, 'hide_empty' => true ] ) as $term ) {
		$add( get_term_link( $term ), $tax );
	}
}

echo wp_json_encode( array_values( $out ), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES );
