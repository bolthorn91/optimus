import type { ActNumber } from '@/app/routes';

export interface PairedBlockSide {
  id: string;
  name: string;
  accentToken: string;
  detail?: string;
}

export type ActFigure =
  | {
      kind: 'table';
      caption: string;
      columns: readonly string[];
      rows: readonly (readonly string[])[];
    }
  | {
      kind: 'paired';
      caption: string;
      left: PairedBlockSide;
      right: PairedBlockSide;
      metricHeader: string;
      rows: readonly { id: string; metric: string; left: string; right: string }[];
    }
  | { kind: 'stat'; value: string; label: string; source: string }
  | {
      kind: 'risk-table';
      copy: { caption: string; regionHeader: string; projectionNote: string };
      periods: readonly {
        id: string;
        shortLabel: string;
        isProjection?: boolean;
        regions: Readonly<Record<string, string | undefined>>;
      }[];
      regions: readonly { id: string; label: string }[];
      levels: readonly { id: string; label: string }[];
    }
  | {
      kind: 'process';
      title: string;
      fromLabel: string;
      toLabel: string;
      stepLabel: string;
      steps: readonly { id: string; title: string; body: string }[];
      notes: readonly string[];
    }
  | { kind: 'image'; src: string; alt: string; caption: string }
  | { kind: 'disclaimer' }
  | { kind: 'pending'; label: string; debtId: string; note?: string }
  | { kind: 'list'; items: readonly string[] }
  | {
      kind: 'glossary';
      heading: string;
      organisations: readonly string[];
      entries: readonly { id: string; term: string; definition: string }[];
    };

export interface ActSection {
  id: string;
  heading?: string;
  paragraphs?: readonly string[];
  blocks?: readonly ActFigure[];
}

export interface ActDetail {
  actNumber: ActNumber;
  sections: readonly ActSection[];
  sources: readonly string[];
}
