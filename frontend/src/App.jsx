import { useEffect, useState } from "react"
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet"
import axios from "axios"
import "leaflet/dist/leaflet.css"

// Color based on risk score
function getRiskColor(score) {
  if (score >= 76) return "#e74c3c"      // 🔴 Critical
  if (score >= 51) return "#e67e22"      // 🟠 High
  if (score >= 26) return "#f1c40f"      // 🟡 Moderate
  return "#2ecc71"                        // 🟢 Safe
}

export default function App() {
  const [riskData, setRiskData] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch risk scores from FastAPI
  useEffect(() => {
    axios.get("http://localhost:8000/risk-scores")
      .then(res => {
        setRiskData(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>

      {/* Header */}
      <div style={{
        background: "#1a1a2e",
        color: "white",
        padding: "15px 30px",
        display: "flex",
        alignItems: "center",
        gap: "15px"
      }}>
        <span style={{ fontSize: "28px" }}>🌧️</span>
        <div>
          <h1 style={{ margin: 0, fontSize: "22px", color: "#4fc3f7" }}>
            ClimateGuard
          </h1>
          <p style={{ margin: 0, fontSize: "12px", color: "#aaa" }}>
            Real-Time Flood & Drought Risk Monitoring System
          </p>
        </div>
      </div>

      {/* Risk Legend */}
      <div style={{
        background: "#f8f9fa",
        padding: "10px 30px",
        display: "flex",
        gap: "20px",
        alignItems: "center",
        borderBottom: "1px solid #ddd"
      }}>
        <span style={{ fontWeight: "bold", fontSize: "13px" }}>Risk Level:</span>
        {[
          { color: "#2ecc71", label: "🟢 Safe (0-25)" },
          { color: "#f1c40f", label: "🟡 Moderate (26-50)" },
          { color: "#e67e22", label: "🟠 High (51-75)" },
          { color: "#e74c3c", label: "🔴 Critical (76-100)" },
        ].map(item => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{
              width: "14px", height: "14px",
              background: item.color,
              borderRadius: "3px"
            }}/>
            <span style={{ fontSize: "12px" }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Main Layout */}
      <div style={{ display: "flex", height: "calc(100vh - 110px)" }}>

        {/* Map */}
        <div style={{ flex: 1 }}>
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap contributors"
            />
          </MapContainer>
        </div>

        {/* Right Panel — District Risk Cards */}
        <div style={{
          width: "320px",
          overflowY: "auto",
          background: "#f8f9fa",
          padding: "15px",
          borderLeft: "1px solid #ddd"
        }}>
          <h3 style={{ margin: "0 0 15px", fontSize: "15px", color: "#333" }}>
            📊 District Risk Scores
          </h3>

          {loading && <p style={{ color: "#888" }}>Loading data...</p>}

          {riskData.map((item, index) => (
            <div key={index} style={{
              background: "white",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "10px",
              borderLeft: `4px solid ${getRiskColor(item.flood_risk_score)}`,
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <p style={{ margin: 0, fontWeight: "bold", fontSize: "14px" }}>
                    {item.districts?.district_name}
                  </p>
                  <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#888" }}>
                    {item.districts?.state_name}
                  </p>
                </div>
                <div style={{
                  background: getRiskColor(item.flood_risk_score),
                  color: "white",
                  borderRadius: "20px",
                  padding: "4px 12px",
                  fontSize: "13px",
                  fontWeight: "bold",
                  alignSelf: "center"
                }}>
                  {item.flood_risk_score}
                </div>
              </div>
              <p style={{ margin: "8px 0 0", fontSize: "12px", color: "#555" }}>
                🌧️ Rainfall: {item.rainfall_mm} mm
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}