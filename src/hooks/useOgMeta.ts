/**
 * useOgMeta — React hook for dynamic OG meta tag injection.
 * Updates document <head> meta tags for social sharing (Facebook, Twitter, WhatsApp).
 *
 * Note: For full SSR/prerender support, use vite-plugin-prerender or an Edge Worker.
 * This hook provides client-side fallback for SPA mode.
 */

import { useEffect } from 'react';

interface OgMetaOptions {
    title: string;
    description: string;
    image?: string;
    video?: string;
    url?: string;
    type?: string;
    structuredData?: Record<string, unknown>;
}

/**
 * Set or update a meta tag in the document head.
 */
function setMeta(property: string, content: string) {
    let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
}

/**
 * Set or update a <meta name="..."> tag (used by Twitter cards).
 */
function setMetaName(name: string, content: string) {
    let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
}

export function useOgMeta(options: OgMetaOptions | null) {
    const title = options?.title;
    const description = options?.description;
    const image = options?.image;
    const video = options?.video;
    const url = options?.url;
    const type = options?.type || 'website';

    useEffect(() => {
        if (!title || !description) return;

        const pageUrl = url ?? window.location.href;

        // Update document title
        document.title = title;

        // Open Graph
        setMeta('og:title', title);
        setMeta('og:description', description);
        setMeta('og:url', pageUrl);
        setMeta('og:type', type);

        if (image) {
            setMeta('og:image', image);
            setMeta('og:image:width', '1200');
            setMeta('og:image:height', '630');
        }

        if (video) {
            setMeta('og:video', video);
            setMeta('og:video:type', 'video/mp4');
            setMeta('og:video:width', '1200');
            setMeta('og:video:height', '630');
        }

        // Twitter Card
        setMetaName('twitter:card', video ? 'player' : 'summary_large_image');
        setMetaName('twitter:title', title);
        setMetaName('twitter:description', description);
        if (image) setMetaName('twitter:image', image);

        // Canonical URL
        let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
        if (!canonicalEl) {
            canonicalEl = document.createElement('link');
            canonicalEl.setAttribute('rel', 'canonical');
            document.head.appendChild(canonicalEl);
        }
        canonicalEl.setAttribute('href', pageUrl);

        // Structured Data (JSON-LD)
        let scriptEl = document.querySelector('script#dynamic-json-ld') as HTMLScriptElement | null;
        if (options?.structuredData) {
            if (!scriptEl) {
                scriptEl = document.createElement('script');
                scriptEl.id = 'dynamic-json-ld';
                scriptEl.type = 'application/ld+json';
                document.head.appendChild(scriptEl);
            }
            scriptEl.textContent = JSON.stringify(options.structuredData);
        } else if (scriptEl) {
            scriptEl.remove();
        }

        // Cleanup: reset title on unmount
        return () => {
            document.title = 'GlideX — Car Rental in Kenya';
            if (scriptEl) scriptEl.remove();
        };
    }, [title, description, image, video, url, type, options?.structuredData]);
}
