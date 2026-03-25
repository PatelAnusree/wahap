import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import axios from "axios";
import API_URL from "../config";
import { EVENT_TYPES, formatTypeLabel, normalizeType } from "../constants/eventTypes";
import { DEFAULT_HERO_BANNERS, fetchHeroBanners } from "../constants/heroBanners";
import "./Home.css";

const HOME_SECTION_PREVIEW_LIMIT = 10;



const formatEventDate = (startDate, endDate) => {
  if (!startDate) return "TBA";
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return "TBA";

  const startStr = start.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  if (!endDate) {
    return `${startStr} onwards`;
  }

  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) {
    return `${startStr} onwards`;
  }

  if (startDate === endDate || start.getTime() === end.getTime()) {
    return startStr;
  }

  return `${startStr} onwards`;
};

function Home() {
  const [events, setEvents] = useState([]);
  const [rowArrows, setRowArrows] = useState({});
  const [heroBanners, setHeroBanners] = useState(DEFAULT_HERO_BANNERS);
  const rowRefs = useRef({});
  const bannerRef = useRef(null);
  const heroIndexRef = useRef(0);
  const heroTimerRef = useRef(null);
  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/events`);
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const apiBanners = await fetchHeroBanners();
        setHeroBanners(apiBanners);
      } catch (error) {
        console.error("Failed to load hero banners:", error);
        setHeroBanners(DEFAULT_HERO_BANNERS);
      }
    };

    loadBanners();
  }, []);


  const formatImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_URL}/${path.replace(/\\/g, "/")}`;
  };

  const rankedEvents = useMemo(() => {
    return events
      .sort((a, b) => {
        const timeA = new Date(a.date || 0).getTime() || 0;
        const timeB = new Date(b.date || 0).getTime() || 0;
        if (timeA !== timeB) return timeA - timeB;
        return (a.name || "").localeCompare(b.name || "");
      });
  }, [events]);

  const groupedEvents = useMemo(() => {
    const grouped = rankedEvents.reduce((acc, event) => {
      const key = normalizeType(event.type || "") || "others";
      if (!acc[key]) acc[key] = [];
      acc[key].push(event);
      return acc;
    }, {});

    const orderedFromMaster = EVENT_TYPES.map((typeItem) => typeItem.value).filter(
      (key) => grouped[key]?.length
    );

    const dynamicKeys = Object.keys(grouped)
      .filter((key) => !orderedFromMaster.includes(key))
      .sort((a, b) => formatTypeLabel(a).localeCompare(formatTypeLabel(b)));

    return [...orderedFromMaster, ...dynamicKeys].map((typeKey) => ({
      typeKey,
      label: formatTypeLabel(typeKey),
      previewItems: grouped[typeKey].slice(0, HOME_SECTION_PREVIEW_LIMIT),
    }));
  }, [rankedEvents]);

  const buildViewAllLink = useCallback(
    (typeKey) => {
      const query = new URLSearchParams();
      query.set("type", typeKey);
      return `/events?${query.toString()}`;
    },
    []
  );

  const updateArrowState = useCallback((typeKey) => {
    const rowEl = rowRefs.current[typeKey];
    if (!rowEl) return;

    const maxLeft = rowEl.scrollWidth - rowEl.clientWidth;
    const showLeft = rowEl.scrollLeft > 8;
    const showRight = maxLeft - rowEl.scrollLeft > 8;

    setRowArrows((prev) => {
      const existing = prev[typeKey] || { showLeft: false, showRight: false };
      if (existing.showLeft === showLeft && existing.showRight === showRight) {
        return prev;
      }

      return {
        ...prev,
        [typeKey]: { showLeft, showRight },
      };
    });
  }, []);

  const scrollRowBy = useCallback(
    (typeKey, direction) => {
      const rowEl = rowRefs.current[typeKey];
      if (!rowEl) return;

      const cardWidth = rowEl.querySelector(".event-card-link")?.clientWidth || 220;
      const step = Math.max(cardWidth * 2, 300);
      rowEl.scrollBy({ left: direction * step, behavior: "smooth" });

      window.setTimeout(() => updateArrowState(typeKey), 340);
    },
    [updateArrowState]
  );

  useEffect(() => {
    groupedEvents.forEach((group) => updateArrowState(group.typeKey));

    const handleResize = () => {
      groupedEvents.forEach((group) => updateArrowState(group.typeKey));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [groupedEvents, updateArrowState]);

  useEffect(() => {
    const bannerEl = bannerRef.current;
    if (!bannerEl || heroBanners.length <= 1) return;

    const children = Array.from(bannerEl.querySelectorAll(".banner"));
    if (children.length <= 1) return;

    heroIndexRef.current = 0;
    bannerEl.scrollTo({ left: 0, behavior: "auto" });

    const moveToIndex = (targetIndex, behavior = "smooth") => {
      const target = children[targetIndex];
      if (!target) return;
      const scrollTo = target.offsetLeft;
      bannerEl.scrollTo({ left: scrollTo, behavior });
    };

    const startAuto = () => {
      if (heroTimerRef.current) window.clearInterval(heroTimerRef.current);
      heroTimerRef.current = window.setInterval(() => {
        heroIndexRef.current = (heroIndexRef.current + 1) % children.length;
        moveToIndex(heroIndexRef.current);
      }, 2600);
    };

    const syncIndexFromScroll = () => {
      const scrollLeft = bannerEl.scrollLeft;
      let nearest = 0;
      let minDistance = Number.POSITIVE_INFINITY;

      children.forEach((item, idx) => {
        const distance = Math.abs(item.offsetLeft - scrollLeft);
        if (distance < minDistance) {
          minDistance = distance;
          nearest = idx;
        }
      });

      heroIndexRef.current = nearest;
    };

    const handleManualIntent = () => {
      syncIndexFromScroll();
      startAuto();
    };

    bannerEl.addEventListener("wheel", handleManualIntent, { passive: true });
    bannerEl.addEventListener("touchstart", handleManualIntent, { passive: true });
    bannerEl.addEventListener("mousedown", handleManualIntent);
    startAuto();

    return () => {
      bannerEl.removeEventListener("wheel", handleManualIntent);
      bannerEl.removeEventListener("touchstart", handleManualIntent);
      bannerEl.removeEventListener("mousedown", handleManualIntent);
      if (heroTimerRef.current) {
        window.clearInterval(heroTimerRef.current);
        heroTimerRef.current = null;
      }
    };
  }, [heroBanners]);

  return (
    <div className="home-page">


      {/* BANNERS */}
      <div className="banner-section" ref={bannerRef}>
        {heroBanners.map((banner) => (
          <img
            key={banner._id || banner.id}
            src={banner.image}
            className="banner"
            alt={banner.alt}
          />
        ))}
      </div>

      <div className="section-meta">
        <h2 className="section-title">Explore by Event Type</h2>
        <p>
          Showing {rankedEvents.length} event{rankedEvents.length === 1 ? "" : "s"} across curated sections
        </p>
      </div>

      {groupedEvents.length === 0 ? (
        <div className="empty-results">
          <h3>No events matched your search.</h3>
          <p>Try another keyword, choose a different city, or clear the query.</p>
        </div>
      ) : (
        groupedEvents.map((group) => (
          <section className="type-section" key={group.typeKey}>
            <div className="type-row-head">
              <h3>{group.label}</h3>
              <Link to={buildViewAllLink(group.typeKey)} className="view-all-link">
                View all
              </Link>
            </div>

            <div className="event-row-shell">
              {rowArrows[group.typeKey]?.showLeft && (
                <button
                  type="button"
                  className="row-arrow left"
                  aria-label={`Scroll ${group.label} left`}
                  onClick={() => scrollRowBy(group.typeKey, -1)}
                >
                  <FaChevronLeft />
                </button>
              )}

              <div
                className="event-row"
                ref={(el) => {
                  rowRefs.current[group.typeKey] = el;
                }}
                onScroll={() => updateArrowState(group.typeKey)}
              >
                {group.previewItems.map((event) => (
                  <Link to={`/event/${event._id}`} key={event._id} className="event-card-link">
                    <article className="event-card">
                      <div className="event-poster-wrap">
                        <img
                          src={formatImageUrl(event.eventImage || event.bannerImage || event.venueLayoutImage)}
                          className="event-poster"
                          alt={event.name || event.title}
                        />
                        <div className="event-bottom-strip">{formatEventDate(event.date, event.endDate)}</div>
                      </div>
                      <div className="event-caption">
                        <h4>{event.name || event.title}</h4>
                        <p>{formatTypeLabel(event.type)}</p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {rowArrows[group.typeKey]?.showRight && (
                <button
                  type="button"
                  className="row-arrow right"
                  aria-label={`Scroll ${group.label} right`}
                  onClick={() => scrollRowBy(group.typeKey, 1)}
                >
                  <FaChevronRight />
                </button>
              )}
            </div>
          </section>
        ))
      )}
    </div>
  );
}

export default Home;