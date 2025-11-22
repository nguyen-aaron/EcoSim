import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import TabBar from "./components/TabBar";
import Home from "./pages/Home";
import Simulate from "./pages/Simulate";
import MesaSim from "./pages/MesaSim";
import Settings from "./pages/Settings";
import Species from "./pages/Species";
import "katex/dist/katex.min.css";

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
        <div className="container main-area">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/simulate" element={<Simulate />} />
            <Route path="/mesa" element={<MesaSim />} />
            <Route path="/species" element={<Species />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
