import { useState } from 'react';
import axios from 'axios';

function TrackRequest() {
  const [requestId, setRequestId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    try {
      const response = await axios.get(`http://localhost:5000/api/requests/${requestId}`);
      setResult(response.data);
    } catch (err) {
      setError('Request not found. Check the ID and try again.');
    }
  };

  return (
    <div className="card">
      <h2>Track My Request</h2>
      <p style={{ marginTop: '-4px', marginBottom: '14px' }}>
        Enter your request ID to track live dispatch status.
      </p>

      <form onSubmit={handleTrack}>
        <div className="form-group">
          <label className="form-label">Request ID</label>
          <input
            type="text"
            placeholder="Enter your request ID"
            value={requestId}
            onChange={(e) => setRequestId(e.target.value)}
          />
        </div>
        <button type="submit">Track Request</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {result && (
        <div className="track-result-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-gray)' }}>Delivery Details</span>
            <span className={`status-tag ${result.status === 'completed' ? 'green' : 'amber'}`}>
              {result.status}
            </span>
          </div>
          <p style={{ margin: 0 }}>
            <strong style={{ color: 'var(--text-white)' }}>Item:</strong> {result.item}
          </p>
        </div>
      )}
    </div>
  );
}

export default TrackRequest;