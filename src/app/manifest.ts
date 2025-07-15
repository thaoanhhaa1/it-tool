import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'JSON to TypeScript Converter',
        short_name: 'JSON2TS',
        description:
            'Công cụ miễn phí chuyển đổi JSON sang TypeScript interface',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#3b82f6',
        orientation: 'portrait',
        categories: ['developer', 'productivity', 'utilities'],
        lang: 'vi',
        icons: [
            {
                src: '/coding_192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/coding_512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/coding_192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/coding_512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
        ],
    };
}
