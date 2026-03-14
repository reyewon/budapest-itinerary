import React, { useState } from 'react';
import TripApp from './components/TripApp';
import TripSelector from './components/TripSelector';

// Import all trip configs
import budapestConfig from './trips/budapest.json';
import malagaConfig from './trips/malaga.json';

const allTrips = [
  malagaConfig,
  budapestConfig,
];

export default function App() {
  const [selectedTrip, setSelectedTrip] = useState(() => {
    // Auto-select if there's only one trip
    if (allTrips.length === 1) return allTrips[0];
    // Check URL hash for direct trip link
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const trip = allTrips.find(t => t.id === hash);
      if (trip) return trip;
    }
    return null;
  });

  const handleSelectTrip = (trip) => {
    setSelectedTrip(trip);
    window.location.hash = trip.id;
    window.scrollTo({ top: 0 });
  };

  const handleBackToTrips = () => {
    setSelectedTrip(null);
    window.location.hash = '';
  };

  // If only one trip, go straight to it
  if (allTrips.length === 1) {
    return <TripApp tripConfig={allTrips[0]} />;
  }

  if (selectedTrip) {
    return (
      <div>
        <button
          onClick={handleBackToTrips}
          className="fixed top-4 left-4 z-[60] bg-white bg-opacity-90 text-gray-700 px-3 py-2 shadow-md text-sm hover:bg-opacity-100 transition-all"
          style={{ borderRadius: '0px', fontFamily: 'Lato, sans-serif' }}
        >
          ← All Trips
        </button>
        <TripApp tripConfig={selectedTrip} />
      </div>
    );
  }

  return <TripSelector trips={allTrips} onSelectTrip={handleSelectTrip} />;
}
