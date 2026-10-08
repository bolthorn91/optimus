import { describe, expect, it } from 'vitest';

import { organizationSchema } from '@/lib/organization';

const SITE = 'https://example.test';

describe('datos estructurados Organization', () => {
  it('DET-14 · Organization sin telephone ni sameAs', () => {
    const schema = organizationSchema(SITE);
    expect(schema['@type']).toBe('Organization');
    expect(schema.name).toBe('OPTIMVS Capital Protegido');
    expect(schema.url).toBe('https://example.test/');
    expect(schema.logo).toBe('https://example.test/og.png');
    expect(schema.location).toEqual([
      { '@type': 'Place', name: 'España' },
      { '@type': 'Place', name: 'Argentina' },
    ]);
    expect(schema).not.toHaveProperty('telephone');
    expect(schema).not.toHaveProperty('sameAs');
    const serialized = JSON.stringify(schema);
    expect(serialized).not.toContain('telephone');
    expect(serialized).not.toContain('sameAs');
  });
});
