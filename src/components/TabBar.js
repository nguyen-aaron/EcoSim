import { NavLink } from "react-router-dom";
import "../styles/TabBar.css";

function TabBar() {
  return (
    <nav className="tab-bar">
      <ul>
        <li>
          <NavLink to="/home">Home</NavLink>
        </li>
        <li>
          <NavLink to="/simulate">Simulate</NavLink>
        </li>
        <li>
          <NavLink to="/mesa">Mesa</NavLink>
        </li>
        <li>
          <NavLink to="/species">Species</NavLink>
        </li>
        <li>
          <NavLink to="/settings">Settings</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default TabBar;
