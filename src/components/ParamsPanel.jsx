function NumberField({ label, name, value, min, max, step=0.01, onChange }) {
  return (
    <label style={{display:'grid',gridTemplateColumns:'160px 1fr',gap:8,alignItems:'center'}}>
      <span style={{color:'var(--muted)',fontSize:12}}>{label}</span>
      <input
        type="number" value={value ?? ''} min={min} max={max} step={step}
        onChange={(e)=>onChange(name, e.target.value)}
        style={{padding:'6px 8px',border:'1px solid rgba(0,0,0,0.08)',borderRadius:8}}
      />
    </label>
  );
}

export default function ParamsPanel({ title='Parameters', fields, values, running, onChange, onReset, onApply }) {
  return (
    <div className="card" style={{ padding:12, marginTop:12 }}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h3 style={{margin:0}}>{title}</h3>
        <div style={{display:'flex',gap:8}}>
          <button className="btn secondary" onClick={onReset}>Reset defaults</button>
          <button className="btn" onClick={onApply}>{running ? 'Apply & Restart' : 'Apply'}</button>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(260px,1fr))',gap:12,marginTop:12}}>
        {fields.map(f => (
          <NumberField key={f.key} label={f.label} name={f.key}
            value={values[f.key]} min={f.min} max={f.max} step={f.step}
            onChange={onChange}/>
        ))}
      </div>
    </div>
  );
}
