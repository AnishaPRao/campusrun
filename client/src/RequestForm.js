import { useState } from 'react';
import axios from 'axios';
import MapView from './MapView';

function RequestForm() {
  const [item, setItem] = useState('');
  const [pickup, setPickup] = useState(null);
  const [drop, setDrop] = useState(null);
  const [mode, setMode] = useState('pickup');

  const handlePickupSet = (lng, lat) => {
    setPickup([lng, lat]);
    setMode('drop');
  };

  const handleDropSet = (lng, lat) => {
    setDrop([lng, lat]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pickup || !drop) {
      alert('Please select both pickup and drop locations on the map.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/requests', {
        item: item,
        pickup: { coordinates: pickup },
        drop: { coordinates: drop },
        urgency: 1
      });
      console.log('Request created:', response.data);
      alert('Request submitted successfully!');
      setItem('');
      setPickup(null);
      setDrop(null);
      setMode('pickup');
    } catch (err) {
      console.error('Error submitting request:', err);
      alert('Something went wrong.');
    }
  };

  return (
    <div>
      <MapView
        mode={mode}
        onPickupSet={handlePickupSet}
        onDropSet={handleDropSet}
        pickupMarker={pickup}
        dropMarker={drop}
      />

      <p>Currently selecting: <strong>{mode}</strong></p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="What do you need delivered?"
          value={item}
          onChange={(e) => setItem(e.target.value)}
        />
        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
}

export default RequestForm;