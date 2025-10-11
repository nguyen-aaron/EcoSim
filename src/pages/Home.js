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
            <Link to="/proposal" className="btn secondary">Read Proposal</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;