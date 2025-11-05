// Hospitalmap component: shows nearby hospitals using Leaflet + OpenStreetMap
// - Gets user geolocation, queries Nominatim (OpenStreetMap) for nearby hospitals
// - Renders a Map centered on the user's location with hospital markers
import { useEffect, useState } from "react"; // hooks only; default React import not required
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Loader from "../UI/loader";

// Fix for missing default Leaflet marker icons in some bundlers/platforms
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

const Hospitalmap = () => {
  // Component state
  const [location, setLocation] = useState(null); // { lat, lng } once geolocation is available
  const [hospitals, setHospitals] = useState([]); // results from Nominatim search
  const [error, setError] = useState(null); // user/location or fetch errors

  // On mount: request user's geolocation and query nearby hospitals
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
        try {
          // Query Nominatim for nearby hospitals within a small bounding box
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=hospital&limit=10&viewbox=${
              longitude - 0.05
            },${latitude + 0.05},${longitude + 0.05},${
              latitude - 0.05
            }&bounded=1`
          );
          const data = await res.json();
          setHospitals(data);
        } catch (err) {
          setError("Failed to fetch hospitals");
        }
      },
      () => setError("Could not get your location")
    );
  }, []);

  // Display errors or loading state before rendering the map
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!location)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );

  return (
    <>
      <header className="text-center py-1 ">
        <h1 className="text-2xl font-bold text-customPurple hover:text-blue-600 transition-colors">
          Nearby Associated Hospitals
        </h1>
      </header>
      <div className="w-full h-[550px] px-6 z-0">
        <MapContainer
          center={location}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
          className="border-4 border-solid-600 z-10"
        >
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={location}>
            <Tooltip direction="top" offset={[0, -10]} opacity={1}>
              You are here
            </Tooltip>
            <Popup>You are here</Popup>
          </Marker>
          {hospitals.map((hospital, i) => (
            <Marker key={i} position={{ lat: hospital.lat, lng: hospital.lon }}>
              <Tooltip
                direction="top"
                offset={[0, -10]}
                opacity={1}
                permanent={false}
              >
                {hospital.display_name}
              </Tooltip>
              <Popup>
                <strong>{hospital.display_name}</strong>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </>
  );
};

export default Hospitalmap;
