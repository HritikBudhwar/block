import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
 return (
    <div className="Hii">
      <ul>
        <li><Link to="/"><h4>Home</h4></Link></li>
        <li><Link to="/leaderboard"><h4>Leader Board</h4></Link></li>
        <li><Link to="/Sign"><h4>Sign In</h4></Link></li>
        <li><Link to="/Analytics"><h4>Analytics</h4></Link></li>
        <li><Link to="/dashboard"><h4>Dash</h4></Link></li>
      </ul>
    </div>
  );
};

export default Navbar;
