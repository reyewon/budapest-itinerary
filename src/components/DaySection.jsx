import React from 'react';
import WeatherWidget from './WeatherWidget';
import DayContent from './DayContent';

export default function DaySection({ day, weatherData, weatherLoading, isPast, completedActivities, toggleActivity, copyToClipboard, tripConfig }) {
  const { theme } = tripConfig;

  return (
    <section id={day.id} className={`mb-12 ${isPast ? 'opacity-70' : ''}`}>
      <h2
        className="text-4xl md:text-5xl font-bold mb-2 inline-block text-white px-4 py-2"
        style={{ backgroundColor: theme.primaryColor }}
      >
        Day {day.dayNum}
      </h2>
      <h3 className="text-2xl md:text-3xl text-gray-700 mb-4">{day.title}</h3>
      <p className="font-lato text-sm text-gray-600 mb-2">
        {new Date(day.date + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
      </p>

      <WeatherWidget weatherData={weatherData} weatherLoading={weatherLoading} />

      <div id={`map-${day.id}`} className="map-container"></div>

      {day.locations.length > 0 && (
        <div className="mb-4">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${day.locations[0].lat},${day.locations[0].lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-lato"
          >
            Open in Google Maps →
          </a>
        </div>
      )}

      {day.activities && day.activities.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-bold mb-3 font-lato">Today's Checklist</h4>
          {day.activities.map(activity => (
            <div
              key={activity.id}
              className={`activity-checkbox ${completedActivities[activity.id] ? 'completed' : ''}`}
            >
              <input
                type="checkbox"
                id={activity.id}
                checked={completedActivities[activity.id] || false}
                onChange={() => toggleActivity(activity.id)}
              />
              <label htmlFor={activity.id} className="text-sm cursor-pointer flex-1">
                {activity.name}
              </label>
            </div>
          ))}
        </div>
      )}

      <hr className="section-divider" />

      <DayContent day={day} tripConfig={tripConfig} copyToClipboard={copyToClipboard} />
    </section>
  );
}
