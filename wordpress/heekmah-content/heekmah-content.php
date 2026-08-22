<?php
/**
 * Plugin Name: Heekmah Structured Content
 * Description: Structured page content and a public REST API for the Heekmah Nuxt website.
 * Version: 1.3.0
 * Author: Heekmah Group
 * Requires at least: 6.4
 * Requires PHP: 8.0
 */

if (!defined('ABSPATH')) {
    exit;
}

define('HEEKMAH_CONTENT_VERSION', '1.3.0');
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

            if ($merged !== $current) {
                update_option($option_name, $merged, false);
            }
        }
    }
}

register_activation_hook(__FILE__, 'heekmah_content_seed_missing_options');
add_action('admin_init', 'heekmah_content_seed_missing_options');

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
    $sanitized = heekmah_content_sanitize($submitted);

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
        ?>
        <fieldset class="heekmah-field heekmah-array-field">
            <legend><?php echo esc_html($label); ?></legend>
            <div class="heekmah-list" data-path="<?php echo esc_attr($name); ?>">
                <?php foreach ($value as $index => $item) : ?>
                    <div class="heekmah-list-item" data-index="<?php echo esc_attr($index); ?>">
                        <div class="heekmah-list-toolbar">
                            <strong><?php echo esc_html(heekmah_content_label($index)); ?></strong>
                            <div>
                                <button class="button-link heekmah-move-up" type="button" aria-label="Move item up">↑</button>
                                <button class="button-link heekmah-move-down" type="button" aria-label="Move item down">↓</button>
                                <button class="button-link-delete heekmah-remove-item" type="button">Remove</button>
                            </div>
                        </div>
                        <?php heekmah_content_render_field($item, array_merge($path, array($index)), $index); ?>
                    </div>
                <?php endforeach; ?>
            </div>
            <?php if ($value !== array()) : ?>
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

    if ($last_key === 'kind' || $last_key === 'id') {
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
                <span>Save here, then run the Nuxt production build. The current live build remains available until deployment completes.</span>
            </div>
        </header>

        <?php if (isset($_GET['updated'])) : ?>
            <div class="notice notice-success is-dismissible"><p>Content saved. Rebuild the Nuxt site to publish this change.</p></div>
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
                <span>Changes update the content API immediately but do not replace the deployed Nuxt files.</span>
                <?php submit_button('Save content', 'primary', 'submit', false); ?>
            </div>
        </form>
    </div>
    <?php
}
