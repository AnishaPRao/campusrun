import { useState, useEffect } from 'react';
import './App.css';
import RequestForm from './RequestForm';
import RunnerDashboard from './RunnerDashboard';
import TrackRequest from './TrackRequest';
import Auth from './Auth';
import Sidebar from './Sidebar';

function App() {
  const [username, setUsername] = useState(null);
  const [activeTab, setActiveTab] = useState('request');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogin = (loggedInUsername) => {
    setUsername(loggedInUsername);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername(null);
  };

  if (!username) {
    return (
      <div className="auth-container">
        <Auth onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        username={username}
        onLogout={handleLogout}
      />
      <main className="main-content">
        {activeTab === 'request' && <RequestForm />}
        {activeTab === 'track' && <TrackRequest />}
        {activeTab === 'runner' && <RunnerDashboard />}
      </main>
    </div>
  );
}

export default App;
