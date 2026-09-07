import { Link } from "react-router-dom";
import { FiMapPin, FiCalendar, FiClock, FiUsers, FiArrowRight } from "react-icons/fi";
import { normalizeImageUrl, handleImageError } from "../utils/imageHelper";
import "./EventCard.css";

// MongoDB uses _id; frontend mock used id — support both

const categoryColors = {
  Technology: "purple",
  Cultural: "pink",
  Sports: "orange",
  Business: "green",
  Art: "pink",
  Music: "purple",
  Food: "orange",
};

export default function EventCard({ event, delay = 0 }) {
  const eventId = event._id || event.id; // MongoDB _id or mock id
  const badgeColor = categoryColors[event.category] || "purple";
  const regCount = event.registeredUsers?.length || event.registered || 0;
  const spotsLeft = event.seats - regCount;
  const percentFull = Math.round((regCount / event.seats) * 100);
  const isFull = spotsLeft <= 0;

  const imageUrl = normalizeImageUrl(event.image, event.category);

  return (
    <Link
      to={`/events/${eventId}`}
      className="event-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Image */}
      <div className="event-card-img-wrap">
        <img
          src={imageUrl}
          alt={event.title}
          className="event-card-img"
          referrerPolicy="no-referrer"
          onError={(e) => handleImageError(e, event.category)}
        />
        <div className="event-card-overlay" />
        <div className="event-card-top-badges">
          <span className={`badge badge-${badgeColor}`}>{event.category}</span>
          {event.price === 0 ? (
            <span className="badge badge-green">Free</span>
          ) : (
            <span className="price-tag">₹{event.price}</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="event-card-body">
        <h3 className="event-card-title">{event.title}</h3>
        <p className="event-card-desc">{event.description}</p>

        {/* Meta */}
        <div className="event-card-meta">
          <span>
            <FiCalendar />{" "}
            {new Date(event.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <span>
            <FiClock /> {event.time}
          </span>
          <span>
            <FiMapPin /> {event.location ? event.location.split(",")[0] : "Campus"}
          </span>
        </div>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="event-card-tags">
            {event.tags.map((tag) => (
              <span key={tag} className="event-tag">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Progress */}
        <div className="event-card-footer">
          <div className="event-progress-wrap">
            <div className="event-progress-info">
              <span className="progress-label">
                <FiUsers /> {regCount}/{event.seats} registered
              </span>
              <span className={`spots-left ${isFull ? "full" : spotsLeft < 50 ? "low" : ""}`}>
                {isFull ? "Full" : `${spotsLeft} spots left`}
              </span>
            </div>
            <div className="progress-bar">
              <div
                className={`progress-fill ${
                  percentFull >= 90 ? "danger" : percentFull >= 70 ? "warning" : ""
                }`}
                style={{ width: `${Math.min(percentFull, 100)}%` }}
              />
            </div>
          </div>
          <div className="event-card-cta">
            View Details <FiArrowRight />
          </div>
        </div>
      </div>
    </Link>
  );
}
