import { adjacentActs, isActRoute, type RouteEntry } from '@/app/routes';
import { DetailLayout } from '@/pages/DetailLayout';

export function DetailPage({ route }: { route: RouteEntry }) {
  const adjacent = isActRoute(route) ? adjacentActs(route.actNumber) : {};

  return (
    <DetailLayout
      title={route.title}
      toc={[]}
      {...(isActRoute(route) ? { actNumber: route.actNumber } : {})}
      {...adjacent}
    />
  );
}
