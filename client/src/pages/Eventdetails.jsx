import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvent();
  }, [id]);

  if (!event) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <Link to="/" style={{ marginBottom: "20px", display: "inline-block" }}>
        ← Back to Events
      </Link>

      <img
        src={`http://localhost:5000/${event.eventImage}`}
        alt={event.name}
        style={{ width: "100%", maxHeight: "400px", objectFit: "cover", borderRadius: "10px" }}
      />

      <h1>{event.name}</h1>
      <p><strong>Type:</strong> {event.type}</p>
      <p><strong>City:</strong> {event.city}</p>
      <p><strong>Address:</strong> {event.address}</p>
      <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
      <p><strong>Duration:</strong> {event.duration}</p>
      <p><strong>Age Limit:</strong> {event.ageLimit}</p>
      <p><strong>Ticket:</strong> {event.ticketType}</p>
      <p><strong>Language:</strong> {event.language}</p>
      
      <h3>About Event</h3>
      <p>{event.aboutEvent}</p>

      {event.layoutImage && (
        <div style={{ marginTop: "20px" }}>
          <h3>Venue Map</h3>
          <img
            src={`http://localhost:5000/${event.layoutImage}`}
            alt="venue map"
            style={{ width: "100%", maxWidth: "600px", border: "1px solid #ddd" }}
          />
        </div>
      )}
    </div>
  );
}

export default EventDetails;