'use client';

interface HoneypotFieldProps {
  value: string;
  onChange: (value: string) => void;
  name?: string;
}

export default function HoneypotField({ value, onChange, name = 'website' }: HoneypotFieldProps) {
  return (
    <div
      style={{
        position: 'absolute',
        left: '-9999px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
        opacity: 0,
        pointerEvents: 'none'
      }}
      aria-hidden="true"
    >
      <label htmlFor={name}>
        Leave this field empty (for spam protection)
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}

