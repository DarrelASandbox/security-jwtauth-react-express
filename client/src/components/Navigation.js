import { NavLink } from 'react-router-dom';

const Navigation = ({ logoutCallback }) => (
  <>
    <nav>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/protected">Protected</NavLink>
        </li>
        <li>
          <NavLink to="/register">Register</NavLink>
        </li>
        <li>
          <button onClick={logoutCallback}>Logout</button>
        </li>
      </ul>
    </nav>
  </>
);

export default Navigation;
