import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";

function AdminMapEditor() {
  const { eventId } = useParams();
  const [searchParams] = useSearchParams();

  // 🔥 read layout from URL
  const layoutImage = searchParams.get("layout");

  const [stalls, setStalls] = useState([]);
  const [clickPos, setClickPos] = useState(null);
  const [stallName, setStallName] = useState("");
  const [stallType, setStallType] = useState("stall");

  // 🧪 DEBUG (very helpful)
  useEffect(() => {
    console.log("EVENT ID:", eventId);
    console.log("LAYOUT IMAGE:", layoutImage);
  }, [eventId, layoutImage]);

  // 🎨 icons
  const getIcon = (type) => {
    const map = {
      stall: "🛍️",
      stage: "🎤",
      restroom: "🚻",
      food: "🍔",
      entry: "🚪",
      exit: "🏁",
      help: "🧭",
    };
    return map[type] || "📍";
  };

  // ✅ click handler (percentage based)
  const handleMapClick = (e) => {
    const rect = e.target.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setClickPos({ x, y });
  };

  // ✅ save stall
  const addStall = async () => {
    if (!clickPos || !stallName.trim()) {
      alert("Click map and enter name");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/stalls/add", {
        eventId,
        name: stallName,
        type: stallType,
        x: clickPos.x,
        y: clickPos.y,
      });

      // update locally
      setStalls((prev) => [
        ...prev,
        { name: stallName, type: stallType, x: clickPos.x, y: clickPos.y },
      ]);

      setStallName("");
      setClickPos(null);
    } catch (err) {
      console.error("STALL SAVE ERROR:", err);
      alert("Error saving stall");
    }
  };

  // 🚨 guard: no layout
  if (!layoutImage) {
    return (
      <div style={{ padding: "20px" }}>
        <h3>❌ Layout not found</h3>
        <p>Make sure event creation redirect worked.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      {/* 🗺️ MAP */}
      <div
        style={{
          position: "relative",
          border: "2px solid #ccc",
        }}
      >
        <img
          src={`http://localhost:5000/${layoutImage}`}
          alt="layout"
          onClick={handleMapClick}
          style={{
            width: "800px",
            cursor: "crosshair",
            display: "block",
          }}
        />

        {/* 🔴 markers */}
        {stalls.map((s, i) => (
          <div
            key={i}
            title={s.name}
            style={{
              position: "absolute",
              left: `${s.x}%`,
              top: `${s.y}%`,
              transform: "translate(-50%, -50%)",
              fontSize: "24px",
            }}
          >
            {getIcon(s.type)}
          </div>
        ))}
      </div>

      {/* 🎛️ SIDE PANEL */}
      <div style={{ width: "250px" }}>
        <h3>Add Element</h3>

        <input
          placeholder="Name"
          value={stallName}
          onChange={(e) => setStallName(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <select
          value={stallType}
          onChange={(e) => setStallType(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        >
          <option value="stall">🛍️ Stall</option>
          <option value="stage">🎤 Stage</option>
          <option value="restroom">🚻 Restroom</option>
          <option value="food">🍔 Food Court</option>
          <option value="entry">🚪 Entry</option>
          <option value="exit">🏁 Exit</option>
          <option value="help">🧭 Help Desk</option>
        </select>

        <button onClick={addStall} style={{ width: "100%" }}>
          Add to Map
        </button>

        {clickPos && (
          <p style={{ fontSize: "12px", marginTop: "10px" }}>
            ✅ Position selected
          </p>
        )}
      </div>
    </div>
  );
}

export default AdminMapEditor;