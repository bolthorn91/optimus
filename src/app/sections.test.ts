import { describe, expect, it } from 'vitest';

import { isAct, milestoneMarks, navEntries, sealOnNavy, sectionAt, SECTIONS } from '@/app/sections';

describe('sections', () => {
  it('deriva cinco entradas de navegación del manifiesto', () => {
    expect(navEntries().map((entry) => entry.label)).toEqual([
      'Escenario',
      'Seguridad',
      'Estrategia',
      'Activos',
      'Nosotros',
    ]);
    expect(navEntries()).toHaveLength(5);
    expect(navEntries().every((entry) => entry.href.startsWith('/#'))).toBe(true);
  });

  it('declara los siete actos', () => {
    expect(SECTIONS.filter(isAct)).toHaveLength(7);
  });

  it('C5 · el acto VII se hospeda en la escena de la firma', () => {
    const row = SECTIONS.find((section) => section.id === 'asesoramiento');
    expect(row?.hostedBy).toBe('firma');
  });

  it('sectionAt recorre el manifiesto con el progreso 0→1', () => {
    expect(sectionAt(0).id).toBe('hero');
    expect(sectionAt(1).id).toBe('contacto');
    expect(sectionAt(0.5).id).toBe('marco');
  });

  it('sealOnNavy solo es navy cuando ambos lados lo son', () => {
    const hero = SECTIONS[0];
    const escenario = SECTIONS[1];
    const marco = SECTIONS[4];
    const activos = SECTIONS[5];
    const firma = SECTIONS[6];
    expect(hero).toBeDefined();
    expect(escenario).toBeDefined();
    expect(marco).toBeDefined();
    expect(activos).toBeDefined();
    expect(firma).toBeDefined();
    if (!hero || !escenario || !marco || !activos || !firma) return;
    expect(sealOnNavy(hero, escenario)).toBe(true);
    expect(sealOnNavy(marco, activos)).toBe(false);
    expect(sealOnNavy(activos, firma)).toBe(false);
    expect(sealOnNavy(activos, activos)).toBe(false);
  });

  it('milestoneMarks deriva el alcanzado del orden del acto actual', () => {
    expect(milestoneMarks(sectionAt(0)).every((mark) => !mark.reached)).toBe(true);
    expect(milestoneMarks(sectionAt(1)).every((mark) => mark.reached)).toBe(true);
    expect(milestoneMarks(sectionAt(0.5)).filter((mark) => mark.reached)).toHaveLength(4);
  });
});
