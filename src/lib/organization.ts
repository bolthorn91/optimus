import { joinUrl } from '@/lib/meta';

export interface OrganizationPlace {
  '@type': 'Place';
  name: string;
}

export interface OrganizationSchema {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  alternateName: string;
  url: string;
  logo: string;
  location: readonly OrganizationPlace[];
}

export function organizationSchema(siteUrl: string): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'OPTIMVS Capital Protegido',
    alternateName: 'Optimus Capital Protegido',
    url: siteUrl.replace(/\/+$/, '') + '/',
    logo: joinUrl(siteUrl, '/brand/optimvs-capital-protegido-logo.png'),
    location: [
      { '@type': 'Place', name: 'España' },
      { '@type': 'Place', name: 'Argentina' },
    ],
  };
}
