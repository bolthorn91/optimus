import { PendingValue } from '@/components/PendingValue';
import { ACT5 } from '@/scenes/05-activos-simulador/content';

export function EntryFloorNote({ note, debtId }: { note: string; debtId: string }) {
  return (
    <section data-entry-floor>
      <h3>{ACT5.copy.entryFloorTitle}</h3>
      <p>{note}</p>
      <PendingValue debtId={debtId} label={ACT5.copy.entryFloorLabel} />
    </section>
  );
}
