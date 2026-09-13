import { useState } from 'react';
import axios from 'axios';
import { Package } from 'lucide-react';

function Auth({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegistering) {
        await axios.post('http://localhost:5000/api/auth/register', { username, password });
        alert('Registered successfully! Please log in.');
        setIsRegistering(false);
      } else {
        const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.username);
        onLogin(response.data.username);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="card auth-card">
      <div className="auth-brand">
        <div className="auth-brand-icon">
          <Package size={32} color="#8b5cf6" />
        </div>
        <h1 className="auth-brand-title">CampusRun</h1>
        <p className="auth-brand-tagline">Campus delivery, coordinated</p>
      </div>

      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px', marginTop: '10px' }}>
        <h2 style={{ fontSize: '18px', textAlign: 'center', marginBottom: '14px' }}>
          {isRegistering ? 'Create an Account' : 'Welcome Back'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" style={{ marginTop: '6px' }}>
            {isRegistering ? 'Register' : 'Login'}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}

        <p
          onClick={() => setIsRegistering(!isRegistering)}
          style={{
            cursor: 'pointer',
            color: '#8b5cf6',
            marginTop: '16px',
            fontSize: '13px',
            fontWeight: 500,
            textAlign: 'center',
            marginBottom: 0
          }}
        >
          {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
        </p>
      </div>
    </div>
  );
}

export default Auth;