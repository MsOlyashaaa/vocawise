interface ProgressRingProps {
  value: number;
  size?: number;
  thickness?: number;
  label?: string;
}

export function ProgressRing({ value, size = 56, thickness = 6, label }: ProgressRingProps) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * Math.max(0, Math.min(1, value));
  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#f4f4f5"
          strokeWidth={thickness}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#ec4899"
          strokeWidth={thickness}
          strokeDasharray={`${dash} ${c}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {label ? <span className="absolute text-xs font-semibold">{label}</span> : null}
    </div>
  );
}
