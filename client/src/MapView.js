import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function LocationPicker({ onPickupSet, onDropSet, mode, onMapMove }) {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      if (mode === 'pickup') {
        onPickupSet(lng, lat);
      } else if (mode === 'drop') {
        onDropSet(lng, lat);
      }
    },
    moveend() {
      const center = map.getCenter();
      onMapMove(center.lng, center.lat);
    }
  });
  return null;
}

function MapView({ onPickupSet, onDropSet, mode, pickupMarker, dropMarker, refreshTrigger }) {
  const [existingRequests, setExistingRequests] = useState([]);
  const [searchCenter, setSearchCenter] = useState({ lng: 78.4867, lat: 17.3850 });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/requests/nearby?lng=${searchCenter.lng}&lat=${searchCenter.lat}&radius=50`)
      .then(response => setExistingRequests(response.data))
      .catch(err => console.error('Error fetching requests:', err));
  }, [refreshTrigger, searchCenter]);

  const handleMapMove = (lng, lat) => {
    setSearchCenter({ lng, lat });
  };

  return (
    <MapContainer center={[17.3850, 78.4867]} zoom={15} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <LocationPicker onPickupSet={onPickupSet} onDropSet={onDropSet} mode={mode} onMapMove={handleMapMove} />
      {pickupMarker && <Marker position={[pickupMarker[1], pickupMarker[0]]} />}
      {dropMarker && <Marker position={[dropMarker[1], dropMarker[0]]} />}
      {existingRequests.map(req => (
        <Marker key={req._id} position={[req.pickup.coordinates[1], req.pickup.coordinates[0]]}>
          <Popup>{req.item}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapView;