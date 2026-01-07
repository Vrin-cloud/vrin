import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/enterprise/dashboard/',
          '/enterprise/chat/',
          '/enterprise/teams/',
          '/enterprise/api-keys/',
          '/enterprise/configurations/',
          '/enterprise/infrastructure/',
          '/auth/',
          '/chat/',
          '/dashboard/',
        ],
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/', '/enterprise/dashboard/', '/auth/', '/chat/', '/dashboard/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ['/api/', '/enterprise/dashboard/', '/auth/', '/chat/', '/dashboard/'],
      },
      {
        userAgent: 'Claude-Web',
        allow: '/',
        disallow: ['/api/', '/enterprise/dashboard/', '/auth/', '/chat/', '/dashboard/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/enterprise/dashboard/', '/auth/', '/chat/', '/dashboard/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/enterprise/dashboard/', '/auth/', '/chat/', '/dashboard/'],
      },
    ],
    sitemap: 'https://www.vrin.cloud/sitemap.xml',
  }
}
