import React from 'react';

function WorldMap({ data }: { data: any }) {
  const locationKey = data?.locations ? Object.keys(data.locations)[0] : null;
  const location = locationKey ? data.locations[locationKey] : null;
  const latitude = typeof location?.latitude === 'number' ? location.latitude : null;
  const longitude = typeof location?.longitude === 'number' ? location.longitude : null;
  const address = location?.address || 'Waiting for live weather data';

  const markerX = longitude !== null ? ((longitude + 180) / 360) * 100 : 78;
  const markerY = latitude !== null ? ((90 - latitude) / 180) * 100 : 38;

  return (
    <section className="map-card">
      <div className="map-copy">
        <p className="map-eyebrow">Global View</p>
        <h2 className="map-title">Track weather from a world map</h2>
        <p className="map-description">
          Search any city or use your current location to pin the forecast on the map.
        </p>
      </div>

      <div className="map-board">
        <svg
          className="map-graphic"
          viewBox="0 0 1000 500"
          role="img"
          aria-label="Stylized world map"
        >
          <defs>
            <linearGradient id="mapGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8be9fd" />
              <stop offset="100%" stopColor="#36cfc9" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="1000" height="500" rx="32" fill="rgba(5, 18, 40, 0.35)" />
          <g className="map-grid" opacity="0.18">
            <path d="M100 40V460M200 40V460M300 40V460M400 40V460M500 40V460M600 40V460M700 40V460M800 40V460M900 40V460" />
            <path d="M40 100H960M40 200H960M40 300H960M40 400H960" />
          </g>
          <g className="map-continents">
            <path d="M126 162l26-37 52-18 51 12 15 27-18 20 11 25-22 27-55 8-26-17-18-30z" />
            <path d="M271 248l31 11 16 49 23 34-12 51-31 31-25-25 7-37-19-42 5-35z" />
            <path d="M430 126l67-21 97 4 69 27 6 28-40 18-57-8-25 17 10 30-28 21-66-5-28-32-29-10-9-31z" />
            <path d="M572 245l34 16 38-4 26 30-11 41-34 25-47-10-18-38z" />
            <path d="M729 166l60-29 84 5 74 39-11 27-41 7-25 33-53 5-25-17-33 13-31-27-17-26z" />
            <path d="M829 289l42 5 27 28-14 33-49 10-26-28z" />
          </g>
          <g className="map-route">
            <path d="M180 282C263 232 381 182 505 209C627 236 712 297 831 250" />
          </g>
          <g
            className="map-marker"
            style={{ transform: `translate(${markerX}%, ${markerY}%)` }}
          >
            <circle className="map-marker-ring" cx="0" cy="0" r="26" />
            <circle className="map-marker-dot" cx="0" cy="0" r="10" />
          </g>
        </svg>

        <div className="map-badge">
          <span className="map-badge-label">Pinned forecast</span>
          <strong>{address}</strong>
        </div>
      </div>
    </section>
  );
}

export default WorldMap;
