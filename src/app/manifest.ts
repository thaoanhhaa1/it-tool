import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'It Tools - Developer Tools',
        short_name: 'It Tools',
        description:
            'Bộ công cụ tiện ích miễn phí dành cho developers: JSON to TypeScript, Interface to Zod, HTML to JSX',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#3b82f6',
        orientation: 'portrait',
        categories: ['developer', 'productivity', 'utilities', 'tools'],
        lang: 'vi',
        scope: '/',
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
        shortcuts: [
            {
                name: 'JSON to TypeScript',
                short_name: 'JSON2TS',
                description: 'Chuyển đổi JSON sang TypeScript interface',
                url: '/json-to-typescript',
                icons: [{ src: '/coding_192.png', sizes: '192x192' }],
            },
            {
                name: 'Interface to Zod',
                short_name: 'TS2Zod',
                description: 'Chuyển đổi TypeScript interface sang Zod schema',
                url: '/interface-to-zod',
                icons: [{ src: '/coding_192.png', sizes: '192x192' }],
            },
            {
                name: 'HTML to JSX',
                short_name: 'HTML2JSX',
                description: 'Chuyển đổi HTML sang JSX component',
                url: '/html-to-jsx',
                icons: [{ src: '/coding_192.png', sizes: '192x192' }],
            },
        ],
    };
}
