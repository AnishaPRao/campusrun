import { Package, PackagePlus, Search, Route, LogOut } from 'lucide-react';

function Sidebar({ activeTab, setActiveTab, username, onLogout }) {
  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-brand">
          <Package size={24} color="#8b5cf6" />
          <span className="sidebar-title">CampusRun</span>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`sidebar-item ${activeTab === 'request' ? 'active' : ''}`}
            onClick={() => setActiveTab('request')}
          >
            <PackagePlus size={18} />
            <span>New Request</span>
          </button>

          <button
            className={`sidebar-item ${activeTab === 'track' ? 'active' : ''}`}
            onClick={() => setActiveTab('track')}
          >
            <Search size={18} />
            <span>Track Request</span>
          </button>

          <button
            className={`sidebar-item ${activeTab === 'runner' ? 'active' : ''}`}
            onClick={() => setActiveTab('runner')}
          >
            <Route size={18} />
            <span>Runner Dashboard</span>
          </button>
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          Hi, {username}
        </div>
        <button className="sidebar-logout-btn" onClick={onLogout}>
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
