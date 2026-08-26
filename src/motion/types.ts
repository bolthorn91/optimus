/** Estado visual que una coreografía produce. Sin DOM (doc 00 M4). */
export type SceneState = Record<string, number | string>;

/** Función pura: progreso 0→1 → estado. Testeable sin GSAP. */
export type Choreograph = (progress: number) => SceneState;
