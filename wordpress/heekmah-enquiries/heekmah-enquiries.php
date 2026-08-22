<?php
/**
 * Plugin Name: Heekmah Enquiries
 * Description: Receives Nuxt website enquiries through the WordPress REST API, stores them privately, and emails the Heekmah team.
 * Version: 1.0.0
 * Author: Heekmah Group
 * Text Domain: heekmah-enquiries
 * Requires at least: 6.4
 * Requires PHP: 7.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class Heekmah_Enquiries {
	private const POST_TYPE         = 'heekmah_enquiry';
	private const REST_NAMESPACE    = 'heekmah/v1';
	private const REST_ROUTE        = '/enquiries';
	private const RATE_LIMIT_MAX    = 5;
	private const RATE_LIMIT_WINDOW = 10 * MINUTE_IN_SECONDS;

	/**
	 * Register WordPress hooks.
	 *
	 * @return void
	 */
	public static function boot() {
		add_action( 'init', array( __CLASS__, 'register_post_type' ) );
		add_action( 'rest_api_init', array( __CLASS__, 'register_rest_route' ) );
		add_action( 'add_meta_boxes_' . self::POST_TYPE, array( __CLASS__, 'add_details_meta_box' ) );
		add_filter( 'manage_' . self::POST_TYPE . '_posts_columns', array( __CLASS__, 'set_admin_columns' ) );
		add_action(
			'manage_' . self::POST_TYPE . '_posts_custom_column',
			array( __CLASS__, 'render_admin_column' ),
			10,
			2
		);
	}

	/**
	 * Grant enquiry-management capabilities to administrators.
	 *
	 * @return void
	 */
	public static function activate() {
		$role = get_role( 'administrator' );

		if ( ! $role ) {
			return;
		}

		foreach ( self::get_admin_capabilities() as $capability ) {
			$role->add_cap( $capability );
		}
	}

	/**
	 * Register the private enquiry post type.
	 *
	 * @return void
	 */
	public static function register_post_type() {
		register_post_type(
			self::POST_TYPE,
			array(
				'labels'              => array(
					'name'          => __( 'Enquiries', 'heekmah-enquiries' ),
					'singular_name' => __( 'Enquiry', 'heekmah-enquiries' ),
					'menu_name'     => __( 'Enquiries', 'heekmah-enquiries' ),
					'all_items'     => __( 'All enquiries', 'heekmah-enquiries' ),
					'edit_item'     => __( 'View enquiry', 'heekmah-enquiries' ),
					'view_item'     => __( 'View enquiry', 'heekmah-enquiries' ),
					'search_items'  => __( 'Search enquiries', 'heekmah-enquiries' ),
					'not_found'     => __( 'No enquiries found.', 'heekmah-enquiries' ),
				),
				'public'              => false,
				'publicly_queryable'  => false,
				'exclude_from_search' => true,
				'show_ui'             => true,
				'show_in_menu'        => true,
				'show_in_rest'        => false,
				'menu_icon'           => 'dashicons-email-alt2',
				'menu_position'       => 26,
				'supports'            => array( 'title' ),
				'capability_type'     => array( 'heekmah_enquiry', 'heekmah_enquiries' ),
				'map_meta_cap'        => true,
				'capabilities'        => array(
					'create_posts' => 'do_not_allow',
				),
			)
		);
	}

	/**
	 * Register the public submission endpoint.
	 *
	 * @return void
	 */
	public static function register_rest_route() {
		register_rest_route(
			self::REST_NAMESPACE,
			self::REST_ROUTE,
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( __CLASS__, 'submit_enquiry' ),
				'permission_callback' => '__return_true',
			)
		);
	}

	/**
	 * Validate, store and email one enquiry.
	 *
	 * @param WP_REST_Request $request REST request.
	 * @return WP_REST_Response|WP_Error
	 */
	public static function submit_enquiry( WP_REST_Request $request ) {
		$honeypot = self::get_string_param( $request, 'website' );

		if ( '' !== $honeypot ) {
			return self::success_response();
		}

		$data           = self::sanitize_submission( $request );
		$invalid_fields = self::get_invalid_fields( $data );

		if ( ! empty( $invalid_fields ) ) {
			return new WP_Error(
				'heekmah_invalid_enquiry',
				__( 'Please check the required fields and try again.', 'heekmah-enquiries' ),
				array(
					'status' => 400,
					'fields' => $invalid_fields,
				)
			);
		}

		if ( self::is_rate_limited() ) {
			return new WP_Error(
				'heekmah_rate_limited',
				__( 'Too many enquiries were sent from this connection. Please wait and try again.', 'heekmah-enquiries' ),
				array( 'status' => 429 )
			);
		}

		$post_id = self::store_enquiry( $data );

		if ( is_wp_error( $post_id ) ) {
			return $post_id;
		}

		$mail_sent = self::email_enquiry( $post_id, $data );
		update_post_meta( $post_id, '_heekmah_mail_status', $mail_sent ? 'sent' : 'failed' );

		return self::success_response();
	}

	/**
	 * Add the enquiry details meta box.
	 *
	 * @return void
	 */
	public static function add_details_meta_box() {
		add_meta_box(
			'heekmah-enquiry-details',
			__( 'Enquiry details', 'heekmah-enquiries' ),
			array( __CLASS__, 'render_details_meta_box' ),
			self::POST_TYPE,
			'normal',
			'high'
		);
	}

	/**
	 * Render the read-only enquiry details.
	 *
	 * @param WP_Post $post Current enquiry.
	 * @return void
	 */
	public static function render_details_meta_box( $post ) {
		$interest_key = (string) get_post_meta( $post->ID, '_heekmah_interest', true );
		$interests    = self::get_interests();
		$interest     = isset( $interests[ $interest_key ] ) ? $interests[ $interest_key ] : $interest_key;
		$rows         = array(
			__( 'Name', 'heekmah-enquiries' )         => get_post_meta( $post->ID, '_heekmah_name', true ),
			__( 'Email', 'heekmah-enquiries' )        => get_post_meta( $post->ID, '_heekmah_email', true ),
			__( 'Phone', 'heekmah-enquiries' )        => get_post_meta( $post->ID, '_heekmah_phone', true ),
			__( 'Organisation', 'heekmah-enquiries' ) => get_post_meta( $post->ID, '_heekmah_organisation', true ),
			__( 'Enquiry type', 'heekmah-enquiries' ) => $interest,
			__( 'Source', 'heekmah-enquiries' )       => get_post_meta( $post->ID, '_heekmah_source', true ),
			__( 'Email status', 'heekmah-enquiries' ) => get_post_meta( $post->ID, '_heekmah_mail_status', true ),
		);

		echo '<table class="widefat striped" style="max-width: 900px"><tbody>';

		foreach ( $rows as $label => $value ) {
			echo '<tr><th scope="row" style="width: 180px">' . esc_html( $label ) . '</th><td>' . esc_html( (string) $value ) . '</td></tr>';
		}

		echo '</tbody></table>';
		echo '<h3>' . esc_html__( 'Message', 'heekmah-enquiries' ) . '</h3>';
		echo '<div style="max-width: 900px; white-space: pre-wrap">' . esc_html( (string) get_post_meta( $post->ID, '_heekmah_message', true ) ) . '</div>';
	}

	/**
	 * Set useful list-table columns.
	 *
	 * @param array<string,string> $columns Existing columns.
	 * @return array<string,string>
	 */
	public static function set_admin_columns( $columns ) {
		return array(
			'cb'                => $columns['cb'],
			'title'             => __( 'Enquiry', 'heekmah-enquiries' ),
			'heekmah_interest' => __( 'Type', 'heekmah-enquiries' ),
			'heekmah_email'    => __( 'Email', 'heekmah-enquiries' ),
			'heekmah_delivery' => __( 'Email status', 'heekmah-enquiries' ),
			'date'              => $columns['date'],
		);
	}

	/**
	 * Render one list-table column.
	 *
	 * @param string $column  Column key.
	 * @param int    $post_id Enquiry ID.
	 * @return void
	 */
	public static function render_admin_column( $column, $post_id ) {
		if ( 'heekmah_interest' === $column ) {
			$interest_key = (string) get_post_meta( $post_id, '_heekmah_interest', true );
			$interests    = self::get_interests();
			echo esc_html( isset( $interests[ $interest_key ] ) ? $interests[ $interest_key ] : $interest_key );
			return;
		}

		if ( 'heekmah_email' === $column ) {
			echo esc_html( (string) get_post_meta( $post_id, '_heekmah_email', true ) );
			return;
		}

		if ( 'heekmah_delivery' === $column ) {
			echo esc_html( (string) get_post_meta( $post_id, '_heekmah_mail_status', true ) );
		}
	}

	/**
	 * Sanitize a request into the stored data shape.
	 *
	 * @param WP_REST_Request $request REST request.
	 * @return array<string,mixed>
	 */
	private static function sanitize_submission( WP_REST_Request $request ) {
		return array(
			'name'         => sanitize_text_field( self::get_string_param( $request, 'name' ) ),
			'email'        => sanitize_email( self::get_string_param( $request, 'email' ) ),
			'phone'        => sanitize_text_field( self::get_string_param( $request, 'phone' ) ),
			'organisation' => sanitize_text_field( self::get_string_param( $request, 'organisation' ) ),
			'interest'     => sanitize_key( self::get_string_param( $request, 'interest' ) ),
			'message'      => sanitize_textarea_field( self::get_string_param( $request, 'message' ) ),
			'consent'      => filter_var( $request->get_param( 'consent' ), FILTER_VALIDATE_BOOLEAN ),
			'source'       => sanitize_text_field( self::get_string_param( $request, 'source' ) ),
		);
	}

	/**
	 * Return field keys that fail validation.
	 *
	 * @param array<string,mixed> $data Sanitized submission.
	 * @return array<int,string>
	 */
	private static function get_invalid_fields( $data ) {
		$invalid = array();

		if ( self::string_length( $data['name'] ) < 2 || self::string_length( $data['name'] ) > 120 ) {
			$invalid[] = 'name';
		}

		if ( ! is_email( $data['email'] ) || self::string_length( $data['email'] ) > 190 ) {
			$invalid[] = 'email';
		}

		if ( self::string_length( $data['phone'] ) > 40 ) {
			$invalid[] = 'phone';
		}

		if ( self::string_length( $data['organisation'] ) > 160 ) {
			$invalid[] = 'organisation';
		}

		if ( ! array_key_exists( $data['interest'], self::get_interests() ) ) {
			$invalid[] = 'interest';
		}

		$message_length = self::string_length( $data['message'] );
		if ( $message_length < 10 || $message_length > 4000 ) {
			$invalid[] = 'message';
		}

		if ( ! $data['consent'] ) {
			$invalid[] = 'consent';
		}

		return $invalid;
	}

	/**
	 * Store one validated enquiry.
	 *
	 * @param array<string,mixed> $data Validated submission.
	 * @return int|WP_Error
	 */
	private static function store_enquiry( $data ) {
		$interests = self::get_interests();
		$title     = sprintf( '%1$s — %2$s', $interests[ $data['interest'] ], $data['name'] );
		$post_id   = wp_insert_post(
			array(
				'post_type'   => self::POST_TYPE,
				'post_status' => 'private',
				'post_title'  => $title,
			),
			true
		);

		if ( is_wp_error( $post_id ) ) {
			return new WP_Error(
				'heekmah_enquiry_storage_failed',
				__( 'The enquiry could not be saved. Please contact us directly.', 'heekmah-enquiries' ),
				array( 'status' => 500 )
			);
		}

		foreach ( $data as $key => $value ) {
			update_post_meta( $post_id, '_heekmah_' . $key, true === $value ? '1' : $value );
		}

		return $post_id;
	}

	/**
	 * Email the stored enquiry to the configured recipient.
	 *
	 * @param int                 $post_id Stored enquiry ID.
	 * @param array<string,mixed> $data    Validated submission.
	 * @return bool
	 */
	private static function email_enquiry( $post_id, $data ) {
		$recipient = defined( 'HEEKMAH_ENQUIRY_RECIPIENT' )
			? HEEKMAH_ENQUIRY_RECIPIENT
			: get_option( 'admin_email' );
		$recipient = apply_filters( 'heekmah_enquiry_recipient', $recipient, $post_id );

		if ( ! is_string( $recipient ) || ! is_email( $recipient ) ) {
			return false;
		}

		$interests = self::get_interests();
		$subject   = sprintf(
			/* translators: 1: enquiry type, 2: sender name. */
			__( '[Heekmah website] %1$s from %2$s', 'heekmah-enquiries' ),
			$interests[ $data['interest'] ],
			$data['name']
		);
		$body      = implode(
			"\n",
			array(
				__( 'A new website enquiry has been saved in WordPress.', 'heekmah-enquiries' ),
				'',
				__( 'Name:', 'heekmah-enquiries' ) . ' ' . $data['name'],
				__( 'Email:', 'heekmah-enquiries' ) . ' ' . $data['email'],
				__( 'Phone:', 'heekmah-enquiries' ) . ' ' . $data['phone'],
				__( 'Organisation:', 'heekmah-enquiries' ) . ' ' . $data['organisation'],
				__( 'Enquiry type:', 'heekmah-enquiries' ) . ' ' . $interests[ $data['interest'] ],
				__( 'Source:', 'heekmah-enquiries' ) . ' ' . $data['source'],
				'',
				__( 'Message:', 'heekmah-enquiries' ),
				$data['message'],
			)
		);
		$headers   = array(
			'Content-Type: text/plain; charset=UTF-8',
			'Reply-To: ' . $data['name'] . ' <' . $data['email'] . '>',
		);

		return wp_mail( $recipient, $subject, $body, $headers );
	}

	/**
	 * Apply a hashed-IP rate limit without storing the raw address.
	 *
	 * @return bool
	 */
	private static function is_rate_limited() {
		$remote_address = isset( $_SERVER['REMOTE_ADDR'] )
			? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) )
			: '';

		if ( '' === $remote_address ) {
			return false;
		}

		$key   = 'heekmah_enquiry_' . hash_hmac( 'sha256', $remote_address, wp_salt( 'nonce' ) );
		$count = (int) get_transient( $key );

		if ( $count >= self::RATE_LIMIT_MAX ) {
			return true;
		}

		set_transient( $key, $count + 1, self::RATE_LIMIT_WINDOW );
		return false;
	}

	/**
	 * Read a scalar request parameter as an unslashed string.
	 *
	 * @param WP_REST_Request $request REST request.
	 * @param string          $key     Parameter key.
	 * @return string
	 */
	private static function get_string_param( WP_REST_Request $request, $key ) {
		$value = $request->get_param( $key );

		if ( ! is_scalar( $value ) ) {
			return '';
		}

		return trim( wp_unslash( (string) $value ) );
	}

	/**
	 * Count characters safely when mbstring is unavailable.
	 *
	 * @param mixed $value Value to count.
	 * @return int
	 */
	private static function string_length( $value ) {
		$string = (string) $value;
		return function_exists( 'mb_strlen' ) ? mb_strlen( $string ) : strlen( $string );
	}

	/**
	 * Return the allowed enquiry types and admin-facing labels.
	 *
	 * @return array<string,string>
	 */
	private static function get_interests() {
		return array(
			'general-enquiry'       => __( 'General enquiry', 'heekmah-enquiries' ),
			'rice-order'            => __( 'Order Heekmah rice', 'heekmah-enquiries' ),
			'find-a-distributor'    => __( 'Find a distributor', 'heekmah-enquiries' ),
			'distribution'          => __( 'Become a distributor or supplier', 'heekmah-enquiries' ),
			'agricultural-services' => __( 'Agricultural services', 'heekmah-enquiries' ),
			'parboiled-rice'        => __( 'Heekmah Parboiled Rice', 'heekmah-enquiries' ),
			'broken-rice'           => __( 'Heekmah Broken Rice', 'heekmah-enquiries' ),
			'rice-bran'             => __( 'Heekmah Rice Bran', 'heekmah-enquiries' ),
			'reject-rice'           => __( 'Heekmah Reject Rice', 'heekmah-enquiries' ),
			'topper'                => __( 'Topper crop growth enhancer', 'heekmah-enquiries' ),
			'partnership'            => __( 'Partnership', 'heekmah-enquiries' ),
		);
	}

	/**
	 * Return primitive capabilities assigned to administrators.
	 *
	 * @return array<int,string>
	 */
	private static function get_admin_capabilities() {
		return array(
			'edit_heekmah_enquiries',
			'edit_others_heekmah_enquiries',
			'edit_private_heekmah_enquiries',
			'edit_published_heekmah_enquiries',
			'read_private_heekmah_enquiries',
			'delete_heekmah_enquiries',
			'delete_private_heekmah_enquiries',
			'delete_published_heekmah_enquiries',
			'delete_others_heekmah_enquiries',
		);
	}

	/**
	 * Return the public success response without exposing storage details.
	 *
	 * @return WP_REST_Response
	 */
	private static function success_response() {
		return new WP_REST_Response(
			array(
				'success' => true,
				'message' => __( 'Thank you. Your enquiry has been received.', 'heekmah-enquiries' ),
			),
			201
		);
	}
}

register_activation_hook( __FILE__, array( 'Heekmah_Enquiries', 'activate' ) );
Heekmah_Enquiries::boot();
