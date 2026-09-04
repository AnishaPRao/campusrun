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
      <form onSubmit={handleTrack}>
        <input
          type="text"
          placeholder="Enter your request ID"
          value={requestId}
          onChange={(e) => setRequestId(e.target.value)}
        />
        <button type="submit">Track</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div>
          <p><strong>Item:</strong> {result.item}</p>
          <p><strong>Status:</strong> {result.status}</p>
        </div>
      )}
    </div>
  );
}

export default TrackRequest;