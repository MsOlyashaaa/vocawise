import { Card } from '@components/Card';

interface Props {
  association?: string | undefined;
  similarSounding?: string | undefined;
}

export function AssociationCallout({ association, similarSounding }: Props) {
  if (!association && !similarSounding) return null;
  return (
    <Card variant="brand">
      <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide">Асоціація</h3>
      {association ? <p className="text-sm">{association}</p> : null}
      {similarSounding ? (
        <p className="mt-2 text-xs opacity-80">
          Схоже на: <strong>{similarSounding}</strong>
        </p>
      ) : null}
    </Card>
  );
}
