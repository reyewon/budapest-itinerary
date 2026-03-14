import React from 'react';

export default function WeatherWidget({ weatherData, weatherLoading }) {
  if (weatherLoading || !weatherData || weatherData.length === 0) return null;

  return (
    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
      <h4 className="text-sm font-bold mb-2 font-lato">Weather Forecast</h4>
      <div className="weather-widget">
        {weatherData.map((hour, idx) => {
          const time = new Date(hour.dt * 1000);
          return (
            <div key={idx} className="weather-hour">
              <div className="text-xs font-lato">{time.getHours()}:00</div>
              <div className="text-2xl my-1">
                {hour.weather[0].main === 'Clear' ? '☀️' :
                 hour.weather[0].main === 'Clouds' ? '☁️' :
                 hour.weather[0].main === 'Rain' ? '🌧️' : '🌤️'}
              </div>
              <div className="text-sm font-bold">{Math.round(hour.main.temp)}°C</div>
              <div className="text-xs text-gray-600">Feels {Math.round(hour.main.feels_like)}°C</div>
              {hour.pop > 0.3 && <div className="text-xs text-blue-600">{Math.round(hour.pop * 100)}%</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
