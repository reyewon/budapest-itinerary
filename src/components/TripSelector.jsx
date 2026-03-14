import React from 'react';

export default function TripSelector({ trips, onSelectTrip }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Playfair+Display:wght@700&display=swap');
        body { font-family: 'Merriweather', serif; }
        h1, h2 { font-family: 'Playfair Display', serif; }
        .font-lato { font-family: 'Lato', sans-serif; }
      `}</style>

      <header className="bg-gray-800 text-white py-12 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-3">My Trips</h1>
        <p className="text-lg text-gray-300 font-lato">Select a trip to view your itinerary</p>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => {
            const startDate = trip.days[0]?.date;
            const endDate = trip.days[trip.days.length - 1]?.date;
            const now = new Date().toISOString().split('T')[0];

            let status = 'upcoming';
            if (endDate < now) status = 'completed';
            else if (startDate <= now) status = 'active';

            return (
              <button
                key={trip.id}
                onClick={() => onSelectTrip(trip)}
                className="text-left bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ focusRingColor: trip.theme.primaryColor }}
              >
                <div className="relative">
                  <img
                    src={trip.images.banner}
                    alt={trip.images.bannerAlt}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = `https://placehold.co/600x300/8B7355/FFFFFF?text=${trip.city}`;
                    }}
                  />
                  <div
                    className="absolute top-3 right-3 text-xs text-white px-2 py-1 font-lato font-bold uppercase tracking-wide"
                    style={{
                      backgroundColor: status === 'active' ? '#22c55e' : status === 'completed' ? '#6b7280' : trip.theme.primaryColor,
                      borderRadius: '0px'
                    }}
                  >
                    {status}
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-bold mb-1">{trip.city}</h2>
                  <p className="text-sm text-gray-600 font-lato mb-2">{trip.country}</p>
                  <p className="text-sm text-gray-500 font-lato">{trip.dateRange}</p>
                  <p className="text-xs text-gray-400 font-lato mt-2">
                    {trip.days.length} {trip.days.length === 1 ? 'day' : 'days'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {trips.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-xl mb-2">No trips yet</p>
            <p className="font-lato text-sm">Add a trip JSON file to <code>src/trips/</code> to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
