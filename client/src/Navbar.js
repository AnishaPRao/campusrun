import { Package, LogOut } from 'lucide-react';

function Navbar({ username, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">
          <Package size={22} color="#8b5cf6" />
        </span>
        <span>CampusRun</span>
      </div>
      {username && (
        <div className="navbar-user">
          <span>Hi, {username}</span>
          <button className="logout-btn" onClick={onLogout}>
            <LogOut size={15} />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;