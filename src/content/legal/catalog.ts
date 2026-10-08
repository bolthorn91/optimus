import { LEGAL_COOKIES } from './cookies';
import { LEGAL_NOTICE } from './notice';
import { LEGAL_PRIVACY } from './privacy';
import type { LegalDocument, LegalId, PendingField } from './types';

export const LEGAL_DOCUMENTS: Record<LegalId, LegalDocument> = {
  notice: LEGAL_NOTICE,
  privacy: LEGAL_PRIVACY,
  cookies: LEGAL_COOKIES,
};

export function pendingFieldsOf(document: LegalDocument): readonly PendingField[] {
  return document.sections.flatMap((section) => section.pending ?? []);
}
