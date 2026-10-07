import type { RouteEntry } from '@/app/routes';
import { DetailLayout } from '@/pages/DetailLayout';

export function DetailPage({ route }: { route: RouteEntry }) {
  return <DetailLayout title={route.title} toc={[]} />;
}
