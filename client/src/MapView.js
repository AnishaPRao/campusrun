import { MapContainer, TileLayer } from 'react-leaflet';

function MapView() {
  return (
    <MapContainer center={[17.3850, 78.4867]} zoom={15} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
    </MapContainer>
  );
}

export default MapView;