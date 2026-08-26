import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ActSeal } from '@/components/ActSeal';

describe('ActSeal', () => {
  it('el sello es decorativo y el romano no se anuncia', () => {
    const { container } = render(<ActSeal act={1} />);
    const seal = container.querySelector('[data-act-seal]');
    expect(seal).toHaveAttribute('aria-hidden', 'true');
    expect(seal).toHaveTextContent('I');
  });

  it('expone el numeral romano del acto', () => {
    const { container } = render(<ActSeal act={1} />);
    expect(container.querySelector('[data-act-seal]')).toHaveTextContent('I');
  });
});
