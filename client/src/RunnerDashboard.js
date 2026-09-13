import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import axios from 'axios';

function RunnerLocationPicker({ onLocationSet }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationSet(lng, lat);
    }
  });
  return null;
}

function RunnerDashboard() {
  const [requests, setRequests] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [runnerLocation, setRunnerLocation] = useState(null);
  const [route, setRoute] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/requests/prioritized')
      .then(response => setRequests(response.data))
      .catch(err => console.error('Error fetching requests:', err));
  }, []);

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleMarkComplete = async (requestId, stopIndex) => {
    try {
      await axios.patch(`http://localhost:5000/api/requests/${requestId}/complete`);
      const updatedRoute = [...route];
      updatedRoute[stopIndex].completed = true;
      setRoute(updatedRoute);
    } catch (err) {
      console.error('Error marking complete:', err);
      alert('Something went wrong.');
    }
  };

  const handleOptimize = async () => {
    if (!runnerLocation) {
      alert('Please click on the map to set your current location first.');
      return;
    }
    if (selectedIds.length === 0) {
      alert('Please select at least one request.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/requests/optimize-route', {
        runnerLng: runnerLocation[0],
        runnerLat: runnerLocation[1],
        requestIds: selectedIds
      });
      setRoute(response.data.route);
    } catch (err) {
      console.error('Error optimizing route:', err);
      alert('Something went wrong optimizing the route.');
    }
  };

  return (
    <div className="card">
      <h2>Runner Dashboard</h2>

      <p>Click on the map to set your current location:</p>
      <div className="map-frame">
        <MapContainer center={[17.3850, 78.4867]} zoom={15} style={{ height: '300px', width: '100%', borderRadius: '10px' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <RunnerLocationPicker onLocationSet={(lng, lat) => setRunnerLocation([lng, lat])} />
          {runnerLocation && <Marker position={[runnerLocation[1], runnerLocation[0]]} />}
        </MapContainer>
      </div>

      <p style={{ marginTop: '16px', marginBottom: '8px' }}>Select requests to batch into optimized route:</p>
      <div className="checklist-container">
        <ul className="checklist-list">
          {requests.map(req => {
            const isSelected = selectedIds.includes(req._id);
            return (
              <li key={req._id} className={`checklist-item ${isSelected ? 'selected' : ''}`}>
                <label className="checklist-label">
                  <input
                    type="checkbox"
                    className="checklist-checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(req._id)}
                  />
                  <span>{req.item}</span>
                  <span className="priority-badge" style={{ marginLeft: 'auto' }}>
                    priority: {req.priority.toFixed(2)}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      <button onClick={handleOptimize} style={{ marginTop: '16px' }}>Optimize Route</button>

      {route && (
        <div className="stepper-box">
          <h3>Optimized Route Manifest</h3>
          <div className="stepper-timeline">
            <div className="stepper-line"></div>
            {route.map((stop, index) => {
              const isCompleted = stop.completed;
              return (
                <div key={index} className="stepper-card">
                  <div className={`stepper-node ${isCompleted ? 'completed' : ''}`}>
                    {index + 1}
                  </div>
                  <div className={`stepper-text ${isCompleted ? 'completed' : ''}`}>
                    {stop.type === 'pickup' ? 'Pick up' : 'Drop off'} request #{stop.requestIndex + 1}
                  </div>
                  {isCompleted ? (
                    <span className="status-tag green">✓ Completed</span>
                  ) : (
                    <button
                      className="btn-sm btn-success"
                      onClick={() => handleMarkComplete(selectedIds[stop.requestIndex], index)}
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default RunnerDashboard;