import type { ActFigure } from '@/content/acts/types';

export type LegalId = 'notice' | 'privacy' | 'cookies';

export interface PendingField {
  label: string;
  debtId: string;
}

export interface LegalSection {
  id: string;
  heading: string;
  paragraphs: readonly string[];
  pending?: readonly PendingField[];
  blocks?: readonly ActFigure[];
}

export interface LegalDocument {
  id: LegalId;
  title: string;
  sections: readonly LegalSection[];
}
