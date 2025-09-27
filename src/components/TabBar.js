import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/TabBar.css';

function TabBar() {
  return (
    <nav className="tab-bar">
      <ul>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/simulate">Simulate</NavLink></li>
        <li><NavLink to="/settings">Settings</NavLink></li>
      </ul>
    </nav>
  );
}

export default TabBar;