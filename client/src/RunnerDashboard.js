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
      <MapContainer center={[17.3850, 78.4867]} zoom={15} style={{ height: '300px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <RunnerLocationPicker onLocationSet={(lng, lat) => setRunnerLocation([lng, lat])} />
        {runnerLocation && <Marker position={[runnerLocation[1], runnerLocation[0]]} />}
      </MapContainer>

      <p>Select requests to batch:</p>
      <ul>
        {requests.map(req => (
          <li key={req._id}>
            <label>
              <input
                type="checkbox"
                checked={selectedIds.includes(req._id)}
                onChange={() => toggleSelect(req._id)}
              />
              {req.item} (priority: {req.priority.toFixed(2)})
            </label>
          </li>
        ))}
      </ul>

      <button onClick={handleOptimize}>Optimize Route</button>

      {route && (
  <div>
    <h3>Optimized Route:</h3>
    <ol>
      {route.map((stop, index) => (
        <li key={index} style={{ textDecoration: stop.completed ? 'line-through' : 'none' }}>
          {stop.type === 'pickup' ? 'Pick up' : 'Drop off'} request #{stop.requestIndex + 1}
          {!stop.completed && (
            <button onClick={() => handleMarkComplete(selectedIds[stop.requestIndex], index)}>
              Mark Complete
            </button>
          )}
        </li>
      ))}
    </ol>
  </div>
)}
    </div>
  );
}

export default RunnerDashboard;