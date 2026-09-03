import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

function LocationPicker({ onPickupSet, onDropSet, mode }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      if (mode === 'pickup') {
        onPickupSet(lng, lat);
      } else if (mode === 'drop') {
        onDropSet(lng, lat);
      }
    }
  });
  return null;
}

function MapView({ onPickupSet, onDropSet, mode, pickupMarker, dropMarker }) {
  return (
    <MapContainer center={[17.3850, 78.4867]} zoom={15} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <LocationPicker onPickupSet={onPickupSet} onDropSet={onDropSet} mode={mode} />
      {pickupMarker && <Marker position={[pickupMarker[1], pickupMarker[0]]} />}
      {dropMarker && <Marker position={[dropMarker[1], dropMarker[0]]} />}
    </MapContainer>
  );
}

export default MapView;