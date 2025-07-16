import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://it-tool-two.vercel.app';

    // Code examples data for sitemap
    const codeExamples = [
        'mui-button',
        'ant-form',
        'debounce-hook',
        'format-currency',
        'api-client',
        'local-storage-hook',
    ];

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/json-to-typescript`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/interface-to-zod`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/html-to-jsx`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/code-library`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        // Individual code example pages
        ...codeExamples.map((exampleId) => ({
            url: `${baseUrl}/code-library/${exampleId}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        })),
    ];
}
