import type { CSSProperties } from 'react';

import { ACT67, type Department, type DeptIcon } from '@/scenes/06-firma/content';

const ICON_PATH: Record<DeptIcon, string> = {
  analysis: 'M4 18V6h4l2 4 2-6 2 8 2-4h4v10H4z',
  finance: 'M4 20V8l8-4 8 4v12H4zM8 12h8M8 16h5',
  development: 'M5 20h14M8 20V9l4-4 4 4v11M12 9v11',
};

function DeptGlyph({ icon }: { icon: DeptIcon }) {
  return (
    <svg aria-hidden="true" className="dept-cards__icon" fill="none" viewBox="0 0 24 24">
      <path
        d={ICON_PATH[icon]}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function DepartmentCards({
  departments,
  progress,
}: {
  departments: readonly Department[];
  progress: readonly number[];
}) {
  return (
    <section data-departments>
      <h3>{ACT67.copy.departmentsHeading}</h3>
      <ul className="dept-cards">
        {departments.map((department, index) => {
          const amount = progress[index] ?? 1;
          return (
            <li
              data-department={department.id}
              key={department.id}
              style={{ ['--card-progress']: String(amount) } as CSSProperties}
            >
              <DeptGlyph icon={department.icon} />
              <h4>{department.name}</h4>
              <p>{department.role}</p>
              <p>{department.output}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
