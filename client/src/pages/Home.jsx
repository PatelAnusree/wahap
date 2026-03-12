import { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";

function Home() {

  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");

  // categories for Best of Live Events
  const categories = [
    {
      name: "Adventure",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
    },
    {
      name: "Concert",
      image: "https://images.unsplash.com/photo-1506157786151-b8491531f063"
    },
    {
      name: "College Fests",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836"
    },
    {
      name: "Comedy",
      image: "https://images.unsplash.com/photo-1521335629791-ce4aec67dd47"
    },
    {
      name: "Exhibition",
      image: "https://images.unsplash.com/photo-1500534623283-312aade485b7"
    }
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/events");
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredEvents = events.filter((event) =>
    (event?.name || "").toLowerCase().includes((search || "").toLowerCase())
  );

  return (
    <div>

      {/* NAVBAR */}
      <div className="navbar">

        <div className="logo">WAHAP</div>

        <input
          className="search"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="location">Hyderabad ▼</div>

        <button className="qr">Scan QR</button>

        <button className="signin">Sign In</button>

      </div>

      {/* BANNERS */}
      <div className="banner-section">

        <img
          src="https://assets-in.bmscdn.com/promotions/cms/creatives/1705928962782_web.jpg"
          className="banner"
          alt="banner"
        />

        <img
          src="https://assets-in.bmscdn.com/promotions/cms/creatives/1705929018504_web.jpg"
          className="banner"
          alt="banner"
        />

      </div>

      {/* RECOMMENDED EVENTS */}
      <h2 className="section-title">All Events</h2>

      <div className="cards">

        {filteredEvents.map((event) => (

          <div key={event._id} className="card">

            <img
              src={`http://localhost:5000/${event.eventImage}`}
              className="card-img"
              alt={event.name}
            />

            <div className="card-info">
              <h4>{event.name}</h4>
              <p className="city">📍 {event.city}</p>
            </div>

          </div>

        ))}

      </div>


      {/* BEST OF LIVE EVENTS */}
      <h2 className="section-title">Best of Live Events</h2>

      <div className="category-cards">

        {categories.map((cat) => (

          <div
            key={cat.name}
            className="category-card"
            onClick={() => window.location.href=`/events?type=${cat.name.toLowerCase()}`}
          >

            <img
              src={cat.image}
              className="category-img"
              alt={cat.name}
            />

            <div className="category-title">
              {cat.name}
            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Home;