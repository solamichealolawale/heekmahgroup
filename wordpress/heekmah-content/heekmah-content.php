<?php
/**
 * Plugin Name: Heekmah Structured Content
 * Description: Structured page content and a public REST API for the Heekmah Nuxt website.
 * Version: 1.6.0
 * Author: Heekmah Group
 * Requires at least: 6.4
 * Requires PHP: 8.0
 */

if (!defined('ABSPATH')) {
    exit;
}

define('HEEKMAH_CONTENT_VERSION', '1.6.0');
define('HEEKMAH_CONTENT_DIR', plugin_dir_path(__FILE__));

/**
 * @return array<string, string>
 */
function heekmah_content_keys(): array
{
    return array(
        'site' => 'Site settings',
        'home' => 'Home page',
        'about' => 'About page',
        'rice' => 'Heekmah Rice',
        'services' => 'Integral Services',
        'contact' => 'Contact page',
        'blog' => 'Blog page',
        'privacy' => 'Privacy policy',
        'terms' => 'Terms',
        'refunds' => 'Refund policy',
    );
}

function heekmah_content_option_name(string $key): string
{
    return 'heekmah_content_' . $key;
}

/**
 * @return array<string, mixed>
 */
function heekmah_content_seed(): array
{
    $seed_path = HEEKMAH_CONTENT_DIR . 'content/seed.json';

    if (!is_readable($seed_path)) {
        return array();
    }

    $contents = file_get_contents($seed_path);

    if ($contents === false) {
        return array();
    }

    $seed = json_decode($contents, true);

    return is_array($seed) ? $seed : array();
}

function heekmah_content_merge_missing_defaults($current, $defaults)
{
    if (!is_array($current) || !is_array($defaults) || heekmah_content_is_list($defaults)) {
        return $current;
    }

    foreach ($defaults as $key => $default_value) {
        if (!array_key_exists($key, $current)) {
            $current[$key] = $default_value;
            continue;
        }

        if (is_array($current[$key]) && is_array($default_value)) {
            $current[$key] = heekmah_content_merge_missing_defaults($current[$key], $default_value);
        }
    }

    return $current;
}

/**
 * Keep the original WordPress homepage slider available during upgrades from
 * plugin versions whose bundled seed only had primary and secondary images.
 *
 * @return array<int, array<string, int|string>>
 */
function heekmah_content_original_home_slides(): array
{
    return array(
        array(
            'src' => 'https://heekmahgroup.com/wp-content/uploads/2024/12/pexels-agro-oliveira-289675200-13157324-1-scaled.webp',
            'alt' => 'Green agricultural machinery lined up inside a manufacturing facility',
            'title' => 'Innovative Solutions for Sustainable Agriculture',
            'description' => 'From premium rice production to eco-friendly farm inputs, Heekmah Group is your trusted partner in driving food security and agricultural excellence.',
            'width' => 2560,
            'height' => 1620,
            'attachmentId' => 8739,
        ),
        array(
            'src' => 'https://heekmahgroup.com/wp-content/uploads/2025/01/heekah.webp',
            'alt' => 'Stacked bags of Heekmah Rice ready for distribution',
            'title' => 'The No. 1 Choice for Healthy, Nutritious Rice',
            'description' => 'Our state-of-the-art processing ensures clean, stone-free, long-grain rice for your home or business. Available in 50kg, 25kg, and 10kg packages.',
            'width' => 2560,
            'height' => 1620,
            'attachmentId' => 8886,
        ),
        array(
            'src' => 'https://heekmahgroup.com/wp-content/uploads/2025/01/outgrowers.webp',
            'alt' => 'Heekmah team reviewing seedlings inside a greenhouse',
            'title' => 'Join Our Out-Grower Program',
            'description' => 'We support farmers with seeds, fertilizers, mechanization, and market access, ensuring improved yields and better livelihoods.',
            'width' => 2560,
            'height' => 1620,
            'attachmentId' => 8882,
        ),
        array(
            'src' => 'https://heekmahgroup.com/wp-content/uploads/2025/01/chemical.webp',
            'alt' => 'Crop protection work in a rice field',
            'title' => 'Eco-Friendly Fertilizers, Chemicals, and Mechanization Services',
            'description' => 'We support farmers with seeds, fertilizers, mechanization, and market access, ensuring improved yields and better livelihoods.',
            'width' => 2560,
            'height' => 1620,
            'attachmentId' => 8892,
        ),
    );
}

/**
 * Add the preserved Prime Slider copy to legacy slide records and remove the
 * retired fifth slide once. Later editor-created slides remain untouched.
 *
 * @param mixed $slides
 * @return mixed
 */
function heekmah_content_migrate_home_slides($slides)
{
    if (!is_array($slides)) {
        return $slides;
    }

    $defaults_by_id = array();

    foreach (heekmah_content_original_home_slides() as $default_slide) {
        $defaults_by_id[(int) $default_slide['attachmentId']] = $default_slide;
    }

    $migrated = array();

    foreach ($slides as $slide) {
        if (!is_array($slide)) {
            $migrated[] = $slide;
            continue;
        }

        $attachment_id = isset($slide['attachmentId']) ? (int) $slide['attachmentId'] : 0;
        $is_legacy_slide = !array_key_exists('title', $slide) && !array_key_exists('description', $slide);

        if ($is_legacy_slide && $attachment_id === 8747) {
            continue;
        }

        if ($is_legacy_slide && isset($defaults_by_id[$attachment_id])) {
            $slide['title'] = $defaults_by_id[$attachment_id]['title'];
            $slide['description'] = $defaults_by_id[$attachment_id]['description'];
        }

        $migrated[] = $slide;
    }

    return $migrated;
}

/**
 * Move the homepage conversion copy from an opening prompt to a clear final
 * decision point without overwriting later editorial changes.
 *
 * @param mixed $conversion
 * @return mixed
 */
function heekmah_content_migrate_home_conversion($conversion)
{
    if (!is_array($conversion)) {
        return $conversion;
    }

    if (($conversion['eyebrow'] ?? '') === 'Start here') {
        $conversion['eyebrow'] = 'Next steps';
    }

    if (($conversion['title'] ?? '') === 'How can we help?') {
        $conversion['title'] = 'Talk to the right team';
    }

    return $conversion;
}

/**
 * Replace the former promotional slider headlines with short image captions.
 * Exact-title matching preserves anything an editor has already rewritten.
 *
 * @param mixed $slides
 * @return mixed
 */
function heekmah_content_migrate_home_slide_captions($slides)
{
    if (!is_array($slides)) {
        return $slides;
    }

    $captions = array(
        8739 => array(
            'from' => 'Innovative Solutions for Sustainable Agriculture',
            'to' => 'Farm mechanisation',
        ),
        8886 => array(
            'from' => 'The No. 1 Choice for Healthy, Nutritious Rice',
            'to' => 'Heekmah Rice, ready for distribution',
        ),
        8882 => array(
            'from' => 'Join Our Out-Grower Program',
            'to' => 'Supporting our out-growers',
        ),
        8892 => array(
            'from' => 'Eco-Friendly Fertilizers, Chemicals, and Mechanization Services',
            'to' => 'Crop protection in practice',
        ),
    );

    foreach ($slides as $index => $slide) {
        if (!is_array($slide)) {
            continue;
        }

        $attachment_id = isset($slide['attachmentId']) ? (int) $slide['attachmentId'] : 0;

        if (isset($captions[$attachment_id]) && ($slide['title'] ?? '') === $captions[$attachment_id]['from']) {
            $slides[$index]['title'] = $captions[$attachment_id]['to'];
        }
    }

    return $slides;
}

function heekmah_content_migrate_1_6_0(): void
{
    if (get_option('heekmah_content_migrated_1_6_0', false)) {
        return;
    }

    // Restore every newly introduced field before applying exact-value copy
    // migrations so direct upgrades from older plugin versions are ordered.
    heekmah_content_seed_missing_options();

    $option_name = heekmah_content_option_name('home');
    $home = get_option($option_name, null);
    $changed = false;

    if (is_array($home)) {
        if (array_key_exists('conversion', $home)) {
            $migrated_conversion = heekmah_content_migrate_home_conversion($home['conversion']);

            if ($migrated_conversion !== $home['conversion']) {
                $home['conversion'] = $migrated_conversion;
                $changed = true;
            }
        }

        if (isset($home['hero']) && is_array($home['hero']) && array_key_exists('slides', $home['hero'])) {
            $migrated_slides = heekmah_content_migrate_home_slide_captions($home['hero']['slides']);

            if ($migrated_slides !== $home['hero']['slides']) {
                $home['hero']['slides'] = $migrated_slides;
                $changed = true;
            }
        }

        if (array_key_exists('partnership', $home)) {
            unset($home['partnership']);
            $changed = true;
        }

        if ($changed) {
            update_option($option_name, $home, false);
        }
    }

    $site_option_name = heekmah_content_option_name('site');
    $site = get_option($site_option_name, null);

    if (is_array($site) && isset($site['legalLinks']) && is_array($site['legalLinks'])) {
        $has_privacy_link = false;

        foreach ($site['legalLinks'] as $link) {
            if (is_array($link) && ($link['to'] ?? '') === '/privacy-policy/') {
                $has_privacy_link = true;
                break;
            }
        }

        if (!$has_privacy_link) {
            array_unshift($site['legalLinks'], array('label' => 'Privacy', 'to' => '/privacy-policy/'));
            update_option($site_option_name, $site, false);
        }
    }

    update_option('heekmah_content_migrated_1_6_0', true, false);
}

function heekmah_content_seed_missing_options(): void
{
    $seed = heekmah_content_seed();

    foreach (heekmah_content_keys() as $key => $_label) {
        $option_name = heekmah_content_option_name($key);

        $current = get_option($option_name, null);

        if ($current === null && array_key_exists($key, $seed)) {
            add_option($option_name, $seed[$key], '', false);
            continue;
        }

        if (is_array($current) && isset($seed[$key]) && is_array($seed[$key])) {
            $merged = heekmah_content_merge_missing_defaults($current, $seed[$key]);

            if ($key === 'home' && isset($merged['hero']) && is_array($merged['hero'])) {
                if (!array_key_exists('slides', $merged['hero'])) {
                    $merged['hero']['slides'] = heekmah_content_original_home_slides();
                }

                $merged['hero']['slides'] = heekmah_content_migrate_home_slides($merged['hero']['slides']);
                unset($merged['hero']['primaryImage'], $merged['hero']['secondaryImage'], $merged['hero']['imageCaption']);
            }

            if ($merged !== $current) {
                update_option($option_name, $merged, false);
            }
        }
    }
}

register_activation_hook(__FILE__, 'heekmah_content_seed_missing_options');
add_action('admin_init', 'heekmah_content_seed_missing_options');
add_action('init', 'heekmah_content_migrate_1_6_0', 1);

function heekmah_content_register_rest_routes(): void
{
    register_rest_route(
        'heekmah/v1',
        '/content/(?P<key>[a-z0-9_-]+)',
        array(
            'methods' => WP_REST_Server::READABLE,
            'callback' => 'heekmah_content_rest_response',
            'permission_callback' => '__return_true',
            'args' => array(
                'key' => array(
                    'required' => true,
                    'sanitize_callback' => 'sanitize_key',
                ),
            ),
        )
    );
}
add_action('rest_api_init', 'heekmah_content_register_rest_routes');

/**
 * Allow short shared caching for the anonymous native Post reads used by the
 * Nuxt browser refresh. Authenticated/editor responses remain private.
 *
 * @param mixed $response
 * @return mixed
 */
function heekmah_content_cache_public_post_response($response, WP_REST_Server $server, WP_REST_Request $request)
{
    unset($server);

    if (
        $request->get_method() !== WP_REST_Server::READABLE ||
        is_user_logged_in() ||
        $request->get_route() !== '/wp/v2/posts'
    ) {
        return $response;
    }

    $rest_response = rest_ensure_response($response);

    if (
        $rest_response instanceof WP_REST_Response &&
        $rest_response->get_status() >= 200 &&
        $rest_response->get_status() < 300
    ) {
        $rest_response->header('Cache-Control', 'public, max-age=30, stale-while-revalidate=120');
        $rest_response->header('Vary', 'Origin, Cookie, Authorization');
    }

    return $rest_response;
}
add_filter('rest_post_dispatch', 'heekmah_content_cache_public_post_response', 10, 3);

/**
 * @return WP_REST_Response|WP_Error
 */
function heekmah_content_rest_response(WP_REST_Request $request)
{
    $key = sanitize_key((string) $request->get_param('key'));
    $keys = heekmah_content_keys();

    if (!array_key_exists($key, $keys)) {
        return new WP_Error('heekmah_content_not_found', 'Content collection not found.', array('status' => 404));
    }

    $content = get_option(heekmah_content_option_name($key), null);

    if ($content === null) {
        return new WP_Error('heekmah_content_unavailable', 'Content collection is not available.', array('status' => 404));
    }

    $response = rest_ensure_response(heekmah_content_enrich_media($content));
    $response->header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    $response->header('X-Heekmah-Content-Version', HEEKMAH_CONTENT_VERSION);

    return $response;
}

function heekmah_content_add_admin_menu(): void
{
    add_menu_page(
        'Heekmah Content',
        'Heekmah Content',
        'manage_options',
        'heekmah-content',
        'heekmah_content_render_admin_page',
        'dashicons-layout',
        24
    );
}
add_action('admin_menu', 'heekmah_content_add_admin_menu');

function heekmah_content_enqueue_admin_assets(string $hook_suffix): void
{
    if ($hook_suffix !== 'toplevel_page_heekmah-content') {
        return;
    }

    wp_enqueue_media();
    wp_enqueue_style(
        'heekmah-content-admin',
        plugins_url('assets/admin.css', __FILE__),
        array(),
        HEEKMAH_CONTENT_VERSION
    );
    wp_enqueue_script(
        'heekmah-content-admin',
        plugins_url('assets/admin.js', __FILE__),
        array(),
        HEEKMAH_CONTENT_VERSION,
        true
    );
}
add_action('admin_enqueue_scripts', 'heekmah_content_enqueue_admin_assets');

/**
 * @param mixed $value
 * @return mixed
 */
function heekmah_content_sanitize($value)
{
    if (is_array($value)) {
        $clean = array();

        foreach ($value as $key => $item) {
            $clean_key = is_int($key) ? $key : preg_replace('/[^A-Za-z0-9_-]/', '', (string) $key);

            if ($clean_key === '') {
                continue;
            }

            $clean[$clean_key] = heekmah_content_sanitize($item);
        }

        return $clean;
    }

    if (is_bool($value)) {
        return $value;
    }

    if (is_numeric($value) && !is_string($value)) {
        return $value;
    }

    return sanitize_textarea_field((string) $value);
}

function heekmah_content_destination_is_safe(string $destination): bool
{
    $destination = trim($destination);

    if ($destination === '' || preg_match('/[\x00-\x1F\x7F]/', $destination) || strpos($destination, '\\') !== false) {
        return false;
    }

    if (strpos($destination, '#') === 0) {
        return strlen($destination) > 1;
    }

    if (strpos($destination, '/') === 0) {
        return strpos($destination, '//') !== 0;
    }

    $scheme = strtolower((string) wp_parse_url($destination, PHP_URL_SCHEME));

    if ($scheme === 'https') {
        return wp_http_validate_url($destination) !== false;
    }

    if ($scheme === 'mailto') {
        $address = substr($destination, strlen('mailto:'));
        return $address !== '' && sanitize_email($address) === $address;
    }

    if ($scheme === 'tel') {
        $number = substr($destination, strlen('tel:'));
        return $number !== '' && preg_match('/^\+?[0-9(). -]+$/', $number) === 1;
    }

    return false;
}

/**
 * @param mixed $value
 */
function heekmah_content_has_unsafe_destination($value): bool
{
    if (!is_array($value)) {
        return false;
    }

    foreach ($value as $key => $item) {
        if ($key === 'to' && is_string($item) && !heekmah_content_destination_is_safe($item)) {
            return true;
        }

        if (heekmah_content_has_unsafe_destination($item)) {
            return true;
        }
    }

    return false;
}

/**
 * Preserve the scalar types defined by the bundled content contract. Browser
 * form submissions arrive as strings, including number and checkbox inputs.
 *
 * @param mixed $value
 * @param mixed $default
 * @return mixed
 */
function heekmah_content_normalize_types($value, $default)
{
    if (is_array($value)) {
        if (!is_array($default)) {
            return array_map(
                static fn($item) => heekmah_content_normalize_types($item, null),
                $value
            );
        }

        $normalized = array();
        $default_is_list = heekmah_content_is_list($default);

        foreach ($value as $key => $item) {
            $item_default = null;

            if ($default_is_list) {
                if (is_array($item) && isset($item['kind'])) {
                    foreach ($default as $candidate) {
                        if (is_array($candidate) && ($candidate['kind'] ?? null) === $item['kind']) {
                            $item_default = $candidate;
                            break;
                        }
                    }
                }

                if ($item_default === null) {
                    $item_default = $default[$key] ?? ($default[0] ?? null);
                }
            } elseif (array_key_exists($key, $default)) {
                $item_default = $default[$key];
            }

            $normalized[$key] = heekmah_content_normalize_types($item, $item_default);
        }

        return $normalized;
    }

    if (is_bool($default)) {
        return filter_var($value, FILTER_VALIDATE_BOOLEAN);
    }

    if (is_int($default) && is_numeric($value)) {
        return (int) $value;
    }

    if (is_float($default) && is_numeric($value)) {
        return (float) $value;
    }

    return $value;
}

function heekmah_content_save_admin_page(): void
{
    if (!current_user_can('manage_options')) {
        wp_die(esc_html__('You do not have permission to edit this content.', 'heekmah-content'));
    }

    check_admin_referer('heekmah_save_content');

    $key = isset($_POST['heekmah_key']) ? sanitize_key(wp_unslash($_POST['heekmah_key'])) : '';

    if (!array_key_exists($key, heekmah_content_keys())) {
        wp_die(esc_html__('Unknown content collection.', 'heekmah-content'));
    }

    $submitted = isset($_POST['heekmah_content']) ? wp_unslash($_POST['heekmah_content']) : array();
    $seed = heekmah_content_seed();
    $default = $seed[$key] ?? array();
    $sanitized = heekmah_content_normalize_types(heekmah_content_sanitize($submitted), $default);

    if (heekmah_content_has_unsafe_destination($sanitized)) {
        wp_die(
            esc_html__('A link destination is unsafe. Use an internal path, page fragment, HTTPS URL, email address or telephone link.', 'heekmah-content'),
            esc_html__('Content not saved', 'heekmah-content'),
            array('response' => 400, 'back_link' => true)
        );
    }

    // The Home editor intentionally hides the legacy article-item fallback.
    // Preserve the stored value when saving other Home-page fields.
    if ($key === 'home' && is_array($sanitized)) {
        $current = get_option(heekmah_content_option_name($key), array());

        if (
            is_array($current) &&
            isset($current['articles']['items']) &&
            !isset($sanitized['articles']['items'])
        ) {
            $sanitized['articles']['items'] = $current['articles']['items'];
        }
    }

    update_option(heekmah_content_option_name($key), $sanitized, false);

    $redirect = add_query_arg(
        array(
            'page' => 'heekmah-content',
            'tab' => $key,
            'updated' => 'true',
        ),
        admin_url('admin.php')
    );

    wp_safe_redirect($redirect);
    exit;
}
add_action('admin_post_heekmah_save_content', 'heekmah_content_save_admin_page');

/**
 * @param array<mixed> $value
 */
function heekmah_content_is_list(array $value): bool
{
    if ($value === array()) {
        return true;
    }

    return array_keys($value) === range(0, count($value) - 1);
}

/**
 * @param array<mixed> $value
 */
function heekmah_content_is_media(array $value): bool
{
    return isset($value['src'], $value['alt'], $value['width'], $value['height']);
}

/**
 * Add WordPress attachment metadata without persisting derived URLs in the
 * editable content. WordPress remains the source of truth for image variants.
 *
 * @param mixed $value
 * @return mixed
 */
function heekmah_content_enrich_media($value)
{
    if (!is_array($value)) {
        return $value;
    }

    if (heekmah_content_is_media($value)) {
        $attachment_id = isset($value['attachmentId']) ? absint($value['attachmentId']) : 0;

        if ($attachment_id === 0 && isset($value['src'])) {
            $attachment_id = attachment_url_to_postid((string) $value['src']);
        }

        if ($attachment_id > 0 && wp_attachment_is_image($attachment_id)) {
            $srcset = wp_get_attachment_image_srcset($attachment_id, 'full');
            $value['attachmentId'] = $attachment_id;

            if (is_string($srcset) && $srcset !== '') {
                $value['srcSet'] = $srcset;
            }
        }

        return $value;
    }

    foreach ($value as $key => $item) {
        $value[$key] = heekmah_content_enrich_media($item);
    }

    return $value;
}

/**
 * @param array<mixed> $value
 */
function heekmah_content_is_link(array $value): bool
{
    return count($value) === 2 && isset($value['label'], $value['to']);
}

function heekmah_content_field_name(array $path): string
{
    $name = 'heekmah_content';

    foreach ($path as $part) {
        $safe_part = is_int($part) ? (string) $part : preg_replace('/[^A-Za-z0-9_-]/', '', (string) $part);
        $name .= '[' . $safe_part . ']';
    }

    return $name;
}

function heekmah_content_label($key): string
{
    if (is_int($key)) {
        return 'Item ' . ($key + 1);
    }

    $label = preg_replace('/(?<!^)[A-Z]/', ' $0', (string) $key);
    $label = str_replace(array('-', '_'), ' ', (string) $label);

    return ucfirst($label);
}

/**
 * @param mixed $value
 */
function heekmah_content_render_field($value, array $path, $key): void
{
    $name = heekmah_content_field_name($path);
    $label = heekmah_content_label($key);
    $last_key = end($path);
    $is_contact_interest_value =
        $last_key === 'value' &&
        ($path[0] ?? '') === 'form' &&
        in_array('interests', $path, true);

    if (is_array($value) && heekmah_content_is_media($value)) {
        $attachment_id = isset($value['attachmentId']) ? absint($value['attachmentId']) : 0;

        if ($attachment_id === 0 && $value['src'] !== '') {
            $attachment_id = attachment_url_to_postid((string) $value['src']);
        }

        ?>
        <fieldset class="heekmah-field heekmah-media-field">
            <legend><?php echo esc_html($label); ?></legend>
            <div class="heekmah-media-preview">
                <?php if ($value['src'] !== '') : ?>
                    <img src="<?php echo esc_url($value['src']); ?>" alt="" />
                <?php endif; ?>
            </div>
            <label>
                <span>Image URL</span>
                <input class="heekmah-media-src" type="url" name="<?php echo esc_attr($name . '[src]'); ?>" value="<?php echo esc_attr($value['src']); ?>" />
            </label>
            <label>
                <span>Alternative text</span>
                <input class="heekmah-media-alt" type="text" name="<?php echo esc_attr($name . '[alt]'); ?>" value="<?php echo esc_attr($value['alt']); ?>" />
            </label>
            <?php if (array_key_exists('title', $value)) : ?>
                <label>
                    <span>Slide title</span>
                    <input type="text" name="<?php echo esc_attr($name . '[title]'); ?>" value="<?php echo esc_attr($value['title']); ?>" />
                </label>
            <?php endif; ?>
            <?php if (array_key_exists('description', $value)) : ?>
                <input data-preserve="true" type="hidden" name="<?php echo esc_attr($name . '[description]'); ?>" value="<?php echo esc_attr($value['description']); ?>" />
            <?php endif; ?>
            <input class="heekmah-media-width" type="hidden" name="<?php echo esc_attr($name . '[width]'); ?>" value="<?php echo esc_attr($value['width']); ?>" />
            <input class="heekmah-media-height" type="hidden" name="<?php echo esc_attr($name . '[height]'); ?>" value="<?php echo esc_attr($value['height']); ?>" />
            <input class="heekmah-media-id" type="hidden" name="<?php echo esc_attr($name . '[attachmentId]'); ?>" value="<?php echo esc_attr($attachment_id); ?>" />
            <button class="button heekmah-choose-media" type="button">Choose from media library</button>
        </fieldset>
        <?php
        return;
    }

    if (is_array($value) && heekmah_content_is_link($value)) {
        ?>
        <fieldset class="heekmah-field heekmah-link-field">
            <legend><?php echo esc_html($label); ?></legend>
            <label>
                <span>Label</span>
                <input type="text" name="<?php echo esc_attr($name . '[label]'); ?>" value="<?php echo esc_attr($value['label']); ?>" />
            </label>
            <label>
                <span>Destination</span>
                <input type="text" name="<?php echo esc_attr($name . '[to]'); ?>" value="<?php echo esc_attr($value['to']); ?>" />
            </label>
        </fieldset>
        <?php
        return;
    }

    if (is_array($value) && heekmah_content_is_list($value)) {
        $is_locked_interest_list =
            ($path[0] ?? '') === 'form' &&
            $last_key === 'interests';
        ?>
        <fieldset class="heekmah-field heekmah-array-field">
            <legend><?php echo esc_html($label); ?></legend>
            <div class="heekmah-list" data-path="<?php echo esc_attr($name); ?>">
                <?php foreach ($value as $index => $item) : ?>
                    <div class="heekmah-list-item" data-index="<?php echo esc_attr($index); ?>">
                        <div class="heekmah-list-toolbar">
                            <strong><?php echo esc_html(heekmah_content_label($index)); ?></strong>
                            <?php if (!$is_locked_interest_list) : ?>
                                <div>
                                    <button class="button-link heekmah-move-up" type="button" aria-label="Move item up">↑</button>
                                    <button class="button-link heekmah-move-down" type="button" aria-label="Move item down">↓</button>
                                    <button class="button-link-delete heekmah-remove-item" type="button">Remove</button>
                                </div>
                            <?php endif; ?>
                        </div>
                        <?php heekmah_content_render_field($item, array_merge($path, array($index)), $index); ?>
                    </div>
                <?php endforeach; ?>
            </div>
            <?php if ($value !== array() && !$is_locked_interest_list) : ?>
                <button class="button heekmah-add-item" type="button">Add <?php echo esc_html(strtolower($label)); ?> item</button>
            <?php endif; ?>
        </fieldset>
        <?php
        return;
    }

    if (is_array($value)) {
        ?>
        <fieldset class="heekmah-field heekmah-group-field">
            <legend><?php echo esc_html($label); ?></legend>
            <div class="heekmah-group-grid">
                <?php foreach ($value as $child_key => $child_value) : ?>
                    <?php heekmah_content_render_field($child_value, array_merge($path, array($child_key)), $child_key); ?>
                <?php endforeach; ?>
            </div>
        </fieldset>
        <?php
        return;
    }

    if ($last_key === 'kind' || $last_key === 'id' || $is_contact_interest_value) {
        ?>
        <input data-preserve="true" type="hidden" name="<?php echo esc_attr($name); ?>" value="<?php echo esc_attr($value); ?>" />
        <?php
        return;
    }

    $is_long = is_string($value) && (strlen($value) > 90 || in_array($last_key, array('body', 'summary', 'description', 'quote', 'answer'), true));
    ?>
    <label class="heekmah-field heekmah-scalar-field">
        <span><?php echo esc_html($label); ?></span>
        <?php if ($is_long) : ?>
            <textarea name="<?php echo esc_attr($name); ?>" rows="4"><?php echo esc_textarea((string) $value); ?></textarea>
        <?php elseif (is_bool($value)) : ?>
            <input type="hidden" name="<?php echo esc_attr($name); ?>" value="0" />
            <input type="checkbox" name="<?php echo esc_attr($name); ?>" value="1" <?php checked($value); ?> />
        <?php elseif (is_int($value) || is_float($value)) : ?>
            <input type="number" name="<?php echo esc_attr($name); ?>" value="<?php echo esc_attr($value); ?>" />
        <?php else : ?>
            <input type="text" name="<?php echo esc_attr($name); ?>" value="<?php echo esc_attr((string) $value); ?>" />
        <?php endif; ?>
    </label>
    <?php
}

function heekmah_content_render_admin_page(): void
{
    if (!current_user_can('manage_options')) {
        return;
    }

    $keys = heekmah_content_keys();
    $requested_tab = isset($_GET['tab']) ? sanitize_key(wp_unslash($_GET['tab'])) : 'site';
    $tab = array_key_exists($requested_tab, $keys) ? $requested_tab : 'site';
    $content = get_option(heekmah_content_option_name($tab), array());
    ?>
    <div class="wrap heekmah-admin">
        <header class="heekmah-admin-header">
            <div>
                <p class="heekmah-admin-eyebrow">Headless website content</p>
                <h1>Heekmah Content</h1>
                <p>Edit the words, actions and WordPress media used by the Nuxt website. The design system remains controlled by the Nuxt components.</p>
            </div>
            <div class="heekmah-publish-note">
                <strong>Publishing workflow</strong>
                <span>Save here, allow up to 30 seconds, then refresh the public page. Regenerate only when search-crawler HTML or a new public route must change.</span>
            </div>
        </header>

        <?php if (isset($_GET['updated'])) : ?>
            <div class="notice notice-success is-dismissible"><p>Content saved. Visitors see the change without a rebuild after the shared freshness window of up to 30 seconds. Regenerate the static release when SEO metadata or search-crawler HTML changes.</p></div>
        <?php endif; ?>

        <nav class="nav-tab-wrapper" aria-label="Content areas">
            <?php foreach ($keys as $key => $label) : ?>
                <a
                    class="nav-tab <?php echo $tab === $key ? 'nav-tab-active' : ''; ?>"
                    href="<?php echo esc_url(add_query_arg(array('page' => 'heekmah-content', 'tab' => $key), admin_url('admin.php'))); ?>"
                ><?php echo esc_html($label); ?></a>
            <?php endforeach; ?>
        </nav>

        <?php if ($tab === 'home' || $tab === 'blog') : ?>
            <div class="notice notice-info inline">
                <p>Blog entries are managed with native <a href="<?php echo esc_url(admin_url('edit.php')); ?>">WordPress Posts</a>. This area controls only the page heading, archive action and surrounding sections.</p>
            </div>
        <?php endif; ?>

        <form class="heekmah-content-form" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" method="post">
            <input type="hidden" name="action" value="heekmah_save_content" />
            <input type="hidden" name="heekmah_key" value="<?php echo esc_attr($tab); ?>" />
            <?php wp_nonce_field('heekmah_save_content'); ?>

            <div class="heekmah-content-panel">
                <?php if (is_array($content)) : ?>
                    <?php foreach ($content as $key => $value) : ?>
                        <?php if ($tab === 'home' && $key === 'articles' && is_array($value)) : ?>
                            <?php unset($value['items']); ?>
                        <?php endif; ?>
                        <?php heekmah_content_render_field($value, array($key), $key); ?>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>

            <div class="heekmah-save-bar">
                <span>Visible content refreshes from this API without replacing the deployed Nuxt files.</span>
                <?php submit_button('Save content', 'primary', 'submit', false); ?>
            </div>
        </form>
    </div>
    <?php
}
