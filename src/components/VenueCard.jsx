import React, { useState } from 'react';

export default function VenueCard({ venue, alternatives, city, copyToClipboard, theme }) {
  const [showAlt, setShowAlt] = useState(false);
  const alt = alternatives[venue.venueName];

  const searchUrl = venue.searchQuery
    ? `https://www.google.com/search?q=${venue.searchQuery}`
    : `https://www.google.com/search?q=${encodeURIComponent(venue.venueName + ' ' + city)}`;

  return (
    <div>
      <div className="suggestion-box">
        <h3>{venue.heading}</h3>
        <p className="font-lato text-sm text-gray-600 mb-2">
          {venue.time && <>{venue.time} • </>}
          <a href={searchUrl} target="_blank" rel="noopener noreferrer">
            {venue.address}
          </a>
        </p>
        {venue.description && (
          <p><strong>{venue.descriptionLabel || 'Why it fits you:'}</strong> {venue.description}</p>
        )}
        {venue.rating && <p><strong>Rating:</strong> {venue.rating}</p>}
        <p><strong>{venue.priceLabel || 'Prices'}:</strong> {venue.prices}</p>
      </div>
      {venue.address && (
        <button
          onClick={() => copyToClipboard(venue.address)}
          className="text-xs text-gray-600 hover:text-gray-800 font-lato mt-1"
        >
          📋 Copy address
        </button>
      )}
      {alt && (
        <>
          <button
            onClick={() => setShowAlt(!showAlt)}
            className="text-xs font-lato mt-2 ml-3 text-white px-3 py-1"
            style={{
              backgroundColor: showAlt ? theme.secondaryColor : theme.primaryColor,
              borderRadius: '0px'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = showAlt ? theme.secondaryHover : theme.primaryHover}
            onMouseLeave={(e) => e.target.style.backgroundColor = showAlt ? theme.secondaryColor : theme.primaryColor}
          >
            {showAlt ? '- Hide' : '+ Show'} Alternative Option
          </button>
          {showAlt && (
            <div className="alternative-option">
              <p className="text-sm font-bold mb-1">{alt.name}</p>
              <p className="text-xs text-gray-600 mb-2">
                <a href={`https://www.google.com/search?q=${encodeURIComponent(alt.name + ' ' + alt.address + ' ' + city)}`} target="_blank" rel="noopener noreferrer">
                  {alt.address}
                </a>
                <button
                  onClick={() => copyToClipboard(alt.address)}
                  className="ml-2 text-gray-600 hover:text-gray-800"
                >
                  📋
                </button>
              </p>
              <p className="text-sm mb-1"><strong>Why:</strong> {alt.why}</p>
              <p className="text-sm mb-1"><strong>{alt.dishes ? 'Dishes' : 'Drinks'}:</strong> {alt.dishes || alt.drinks}</p>
              <p className="text-sm"><strong>Prices:</strong> {alt.prices}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
