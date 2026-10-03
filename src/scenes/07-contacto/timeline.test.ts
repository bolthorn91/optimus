import { describe, expect, it } from 'vitest';

import { choreographActContact } from '@/scenes/07-contacto/timeline';

describe('choreographActContact', () => {
  it('en p=0 el contenido sigue visible; en p=1 está asentado', () => {
    expect(choreographActContact(0).rise).toBe(1);
    expect(choreographActContact(0.6).rise).toBe(0);
    expect(choreographActContact(1).rise).toBe(0);
  });
});
