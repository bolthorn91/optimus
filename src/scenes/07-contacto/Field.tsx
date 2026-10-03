import type { ReactNode } from 'react';

export function Field({
  error,
  field,
  id,
  label,
  children,
}: {
  error: string | undefined;
  field: string;
  id: string;
  label: string;
  children: (a11y: {
    id: string;
    'aria-describedby': string | undefined;
    'aria-invalid': true | undefined;
  }) => ReactNode;
}) {
  const errorId = `${id}-error`;
  return (
    <div className="contact-form__field">
      <label htmlFor={id}>{label}</label>
      {children({
        id,
        'aria-describedby': error ? errorId : undefined,
        'aria-invalid': error ? true : undefined,
      })}
      {error ? (
        <p data-error={field} id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
