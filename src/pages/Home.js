import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <main>
      <section className="card hero" style={{marginBottom:20}}>
        <div className="hero-content">
          <h2>Welcome to EcoSim!</h2>
          <p className="tagline">Explore cause-and-effect in ecosystems with interactive simulations.</p>
          <div className="hero-ctas row" style={{marginTop:12}}>
            <Link to="/simulate" className="btn primary">Try Simulation</Link>
          </div>
        </div>
      </section>

      <section className="card" style={{marginBottom:20}}>
        <h3>How it works</h3>
        <p style={{color:'var(--muted)'}}>Follow three simple steps to run experiments and learn from the results.</p>

        <div className="row" style={{marginTop:12, gap:16, alignItems:'stretch'}}>
          <div className="card" style={{flex:1, textAlign:'left'}}>
            <div style={{fontSize:22}}>🔎 Choose a model</div>
            <p style={{color:'var(--muted)',marginTop:8}}>Select a simulation to study different ecosystem behaviors.</p>
          </div>

          <div className="card" style={{flex:1, textAlign:'left'}}>
            <div style={{fontSize:22}}>⚙️ Configure parameters</div>
            <p style={{color:'var(--muted)',marginTop:8}}>Adjust initial populations, reproduction and mortality rates, and environmental factors using the sliders and inputs.</p>
          </div>

          <div className="card" style={{flex:1, textAlign:'left'}}>
            <div style={{fontSize:22}}>📈 Run & analyze</div>
            <p style={{color:'var(--muted)',marginTop:8}}>Run the simulation, watch real-time charts, save scenarios, and compare results to draw conclusions.</p>
          </div>
        </div>
      </section>

      <section className="card" style={{marginBottom:20}}>
        <h3>Simulations</h3>
        <p style={{color:'var(--muted)'}}>Choose a model to explore different ecosystem behaviors.</p>
        <div className="row" style={{marginTop:12}}>
          <div className="card" style={{flex:1}}>
            <h4>Lotka–Volterra (Predator–Prey)</h4>
            <p style={{color:'var(--muted)'}}>Classic predator-prey oscillation model. Observe population cycles by changing birth/death rates.</p>
            <Link to="/simulate?model=lotka" className="btn primary">Simulate</Link>
          </div>

          <div className="card" style={{flex:1}}>
            <h4>Food Chain Dynamics</h4>
            <p style={{color:'var(--muted)'}}>Multi-level interactions between producers, consumers, and top predators.</p>
            <Link to="/simulate?model=foodchain" className="btn primary">Simulate</Link>
          </div>

          <div className="card" style={{flex:1}}>
            <h4>Invasive Species Model</h4>
            <p style={{color:'var(--muted)'}}>Simulate the effect of an invasive species on native populations and ecosystem stability.</p>
            <Link to="/simulate?model=invasive" className="btn primary">Simulate</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;