import { useApp } from "../context/AppContext";
import TopBar from "../components/TopBar";
import StatusPill from "../components/StatusPill";
import { Truck, MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon path issue with bundlers like Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Hardcoded demo coordinates — swap for real buyer addresses when integrating
const BUYER_LOCATIONS = {
  "GreenBlock Aggregates Sdn Bhd": { lat: 3.0733, lng: 101.5185, address: "Shah Alam, Selangor" },
};

const PLANT_LOCATION = { lat: 2.9927, lng: 101.7877, address: "PLANT-04, Selangor" };

export default function AshOfftake() {
  const { data, permissions, dispatchApproved, setDispatchApproved } = useApp();

  return (
    <div className="flex-1 overflow-y-auto">
      <TopBar title="Ash Offtake" subtitle="Match accumulated ash to registered construction-material buyers" />
      <div className="p-8 flex flex-col gap-6">
        <div className="bg-base-panel border border-base-border rounded-lg shadow-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-base-border text-left text-xs font-mono uppercase tracking-wide text-text-secondary">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Ash Accumulated</th>
                <th className="px-4 py-3 font-medium">Matched Buyer</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {data.ash_log.map((a, i) => (
                <tr key={i} className="border-b border-base-hairline last:border-0">
                  <td className="px-4 py-3 font-mono text-text-primary">{a.date}</td>
                  <td className="px-4 py-3 tabular text-text-primary">{a.ash_accumulated_tons.toFixed(2)} t</td>
                  <td className="px-4 py-3 text-text-secondary">{a.matched_buyer}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={a.dispatch_status} label={a.dispatch_status.replace(/_/g, " ")} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {a.dispatch_status !== "approved" && !dispatchApproved && (
                      <button
                        disabled={!permissions.canApproveDispatch}
                        onClick={() => setDispatchApproved(true)}
                        className="flex items-center gap-1.5 ml-auto bg-accent-dim text-accent text-xs font-medium px-3 py-1.5 rounded-md hover:brightness-125 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Truck size={13} />
                        Request Dispatch
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-base-panel border border-base-border rounded-lg shadow-panel overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-base-border">
            <MapPin size={14} className="text-accent" />
            <h3 className="font-display text-sm font-semibold text-text-primary">Dispatch Destinations</h3>
          </div>
          <div style={{ height: 280 }}>
            <MapContainer
              center={[PLANT_LOCATION.lat, PLANT_LOCATION.lng]}
              zoom={10}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[PLANT_LOCATION.lat, PLANT_LOCATION.lng]}>
                <Popup>WTE Plant — {PLANT_LOCATION.address}</Popup>
              </Marker>
              {data.ash_log.map((a, i) => {
                const loc = BUYER_LOCATIONS[a.matched_buyer];
                if (!loc) return null;
                return (
                  <Marker key={i} position={[loc.lat, loc.lng]}>
                    <Popup>
                      {a.matched_buyer}<br />
                      {a.ash_accumulated_tons.toFixed(2)} t — {a.dispatch_status.replace(/_/g, " ")}
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>

        <p className="text-xs text-text-tertiary">
          Dispatch is always human-approved — the system recommends a match and quantity, it never books logistics automatically.
        </p>
      </div>
    </div>
  );
}