import { joinUrl } from '@/lib/meta';

export interface OrganizationPlace {
  '@type': 'Place';
  name: string;
}

export interface OrganizationSchema {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  location: readonly OrganizationPlace[];
}

export function organizationSchema(siteUrl: string): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'OPTIMVS Capital Protegido',
    url: siteUrl.replace(/\/+$/, '') + '/',
    logo: joinUrl(siteUrl, '/og.png'),
    location: [
      { '@type': 'Place', name: 'España' },
      { '@type': 'Place', name: 'Argentina' },
    ],
  };
}
