import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import TabBar from './components/TabBar';
import Home from './pages/Home';
import Simulate from './pages/Simulate';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="title-container">
            <h1>EcoSim</h1>
            <span className="leaf-icon" role="img" aria-label="leaf">
              🍃
            </span>
          </div>
          <TabBar />
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/simulate" element={<Simulate />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
