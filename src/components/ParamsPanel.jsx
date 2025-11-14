function NumberField({ label, name, value, min, max, step = 0.01, disabled, onChange }) {
  const handleChange = (e) => {
    const v = e.target.value;
    if (v === '') onChange(name, '');
    else onChange(name, parseFloat(v));
  };

  return (
    <label style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 8, alignItems: 'center' }}>
      <span style={{ color: 'var(--muted)', fontSize: 12 }}>{label}</span>
      <input
        type="number"
        value={value === '' ? '' : (value ?? '')}
        min={min} max={max} step={step}
        onChange={handleChange}
        disabled={disabled}
        style={{ padding: '6px 8px', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8, width: '80px', maxWidth: '100%' }}
      />
    </label>
  );
}

function CheckboxField({ label, name, checked, disabled, onChange }) {
  return (
    <label style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 8, alignItems: 'center' }}>
      <span style={{ color: 'var(--muted)', fontSize: 12 }}>{label}</span>
      <input
        type="checkbox"
        checked={!!checked}
        onChange={(e) => onChange(name, e.target.checked)}
        disabled={disabled}
        style={{ width: 18, height: 18 }}
      />
    </label>
  );
}

export default function ParamsPanel({ title = 'Parameters', fields, values, running, onChange, onReset, onApply }) {
  return (
    <div className="card" style={{ padding: 12, marginTop: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn secondary" onClick={onReset}>Reset defaults</button>
          <button className="btn" onClick={onApply}>{running ? 'Apply & Restart' : 'Apply'}</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: 12, marginTop: 12 }}>
        {fields.map(f => {
          const isDisabled = running && !f.live;
          if (f.type === 'checkbox') {
            return (
              <CheckboxField
                key={f.key}
                label={f.label}
                name={f.key}
                checked={values[f.key]}
                disabled={isDisabled}
                onChange={onChange}
              />
            );
          }
          return (
            <NumberField
              key={f.key}
              label={f.label}
              name={f.key}
              value={values[f.key]}
              min={f.min}
              max={f.max}
              step={f.step}
              disabled={isDisabled}
              onChange={onChange}
            />
          );
        })}
      </div>
    </div>
  );
}
