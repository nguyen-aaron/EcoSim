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
            <h4>Rosenzweig–MacArthur</h4>
            <p style={{color:'var(--muted)'}}>Multi-level interactions between producers, consumers, and top predators.</p>
            <Link to="/simulate?model=rosenzweigmacarthur" className="btn primary">Simulate</Link>
          </div>

          <div className="card" style={{flex:1}}>
            <h4>Predator–Prey Mesa Simulation</h4>
            <p style={{color:'var(--muted)'}}>Simulate how an invasive prey species affects native prey and predator populations.</p>
            <Link to="/mesa" className="btn primary">Simulate</Link>
          </div>
        </div>
      </section>

      <section className="card" style={{marginBottom:20}}>
        <h3>Learn</h3>
        <p style={{color:'var(--muted)'}}>Endangered species are plants or animals at risk of extinction due to threats like habitat loss, overexploitation, invasive species, disease, and climate change. Protecting them helps preserve biodiversity and maintain healthy ecosystems.</p>
        <div style={{marginTop:12}}>
          <Link to="/species" className="btn primary">Explore Species</Link>
        </div>
      </section>
    </main>
  );
}

export default Home;