interface Props {
  headers: readonly string[];
  rows: readonly (readonly string[])[];
}

export function GrammarTable({ headers, rows }: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-surface-border bg-surface-card">
      <table className="w-full text-sm">
        <thead className="bg-surface-muted">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-3 py-2 text-left font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="odd:bg-white even:bg-surface-page">
              {r.map((c, j) => (
                <td key={j} className="px-3 py-2 align-top">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
