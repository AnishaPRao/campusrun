import { useState } from 'react';
import axios from 'axios';

function RequestForm() {
  const [item, setItem] = useState('');
  const [pickupLng, setPickupLng] = useState('');
  const [pickupLat, setPickupLat] = useState('');
  const [dropLng, setDropLng] = useState('');
  const [dropLat, setDropLat] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/requests', {
        item: item,
        pickup: { coordinates: [parseFloat(pickupLng), parseFloat(pickupLat)] },
        drop: { coordinates: [parseFloat(dropLng), parseFloat(dropLat)] },
        urgency: 1
      });
      console.log('Request created:', response.data);
      alert('Request submitted successfully!');
    } catch (err) {
      console.error('Error submitting request:', err);
      alert('Something went wrong.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="What do you need delivered?"
        value={item}
        onChange={(e) => setItem(e.target.value)}
      />
      <input
        type="text"
        placeholder="Pickup longitude"
        value={pickupLng}
        onChange={(e) => setPickupLng(e.target.value)}
      />
      <input
        type="text"
        placeholder="Pickup latitude"
        value={pickupLat}
        onChange={(e) => setPickupLat(e.target.value)}
      />
      <input
        type="text"
        placeholder="Drop longitude"
        value={dropLng}
        onChange={(e) => setDropLng(e.target.value)}
      />
      <input
        type="text"
        placeholder="Drop latitude"
        value={dropLat}
        onChange={(e) => setDropLat(e.target.value)}
      />
      <button type="submit">Submit Request</button>
    </form>
  );
}

export default RequestForm;