import React from 'react';
import { Link } from 'react-router-dom';

function Settings() {
  return (
    <div className="container">
      <div className="card" style={{maxWidth:720, margin:'0 auto'}}>
        <h2>Settings</h2>
        <p className="muted">Configure simulation defaults and data sources.</p>

        <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:18}}>

        </div>

        <div style={{marginTop:18}}>
          <Link to="/" className="btn secondary">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default Settings;