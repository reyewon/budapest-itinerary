import React, { useState, useEffect } from 'react';
import DaySection from './DaySection';
import Sidebar from './Sidebar';

const GOOGLE_TRANSLATE_API_KEY = process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY;
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const OPENWEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

const getLocalDate = (timezone) => {
  const now = new Date();
  const localTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
  return localTime.toISOString().split('T')[0];
};

const isDayPast = (dayDate, timezone) => {
  const currentDate = getLocalDate(timezone);
  return dayDate < currentDate;
};

export default function TripApp({ tripConfig }) {
  const { theme, translation, currency, days } = tripConfig;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState(days[0]?.id || '');
  const [sidebarTab, setSidebarTab] = useState('tools');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showAllDays, setShowAllDays] = useState(false);

  const [weatherData, setWeatherData] = useState({});
  const [weatherLoading, setWeatherLoading] = useState(true);

  const [translateFrom, setTranslateFrom] = useState('');
  const [translateTo, setTranslateTo] = useState('');
  const [translating, setTranslating] = useState(false);
  const defaultDirection = `${translation.sourceLang}-${translation.targetLang}`;
  const reverseDirection = `${translation.targetLang}-${translation.sourceLang}`;
  const [translateDirection, setTranslateDirection] = useState(defaultDirection);

  const [homeAmount, setHomeAmount] = useState(currency.defaultHomeAmount);
  const [localAmount, setLocalAmount] = useState(currency.defaultLocalAmount);
  const [exchangeRate, setExchangeRate] = useState(currency.defaultRate);
  const [rateLoading, setRateLoading] = useState(true);

  const [mapsLoaded, setMapsLoaded] = useState(false);

  const storageKey = `completedActivities_${tripConfig.id}`;
  const [completedActivities, setCompletedActivities] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : {};
  });

  const visibleDays = showAllDays ? days : days.filter(day => !isDayPast(day.date, tripConfig.timezone));
  const completedDaysCount = days.length - days.filter(day => !isDayPast(day.date, tripConfig.timezone)).length;
  const tripComplete = visibleDays.length === 0 && !showAllDays;

  // Fetch exchange rate
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${currency.home.code}`);
        const data = await response.json();
        if (data.rates && data.rates[currency.local.code]) {
          const rate = data.rates[currency.local.code];
          setExchangeRate(rate);
          setLocalAmount((parseFloat(homeAmount) * rate).toFixed(0));
        }
        setRateLoading(false);
      } catch (error) {
        console.error('Exchange rate fetch error:', error);
        setRateLoading(false);
      }
    };
    fetchExchangeRate();
  }, [currency.home.code, currency.local.code]);

  // Save completed activities
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(completedActivities));
  }, [completedActivities, storageKey]);

  // Load Google Maps
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapsLoaded(true);
      document.head.appendChild(script);
    } else {
      setMapsLoaded(true);
    }
  }, []);

  // Fetch weather
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${tripConfig.coordinates.lat}&lon=${tripConfig.coordinates.lng}&appid=${OPENWEATHER_API_KEY}&units=metric`
        );
        const data = await response.json();
        setWeatherData({ [tripConfig.city]: data });
        setWeatherLoading(false);
      } catch (error) {
        console.error('Weather fetch error:', error);
        setWeatherLoading(false);
      }
    };
    fetchWeather();
  }, [tripConfig.coordinates.lat, tripConfig.coordinates.lng, tripConfig.city]);

  // Initialize maps
  useEffect(() => {
    if (mapsLoaded) {
      visibleDays.forEach(day => {
        setTimeout(() => initializeMap(day), 100);
      });
    }
  }, [mapsLoaded, visibleDays.length]);

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);

      const sections = visibleDays.map(d => d.id).concat(['prep']);
      let current = visibleDays.length > 0 ? visibleDays[0].id : 'prep';

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            current = section;
            break;
          }
        }
      }

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleDays.length]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (e, id) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  const toggleActivity = (activityId) => {
    setCompletedActivities(prev => ({
      ...prev,
      [activityId]: !prev[activityId]
    }));
  };

  const handlePrint = () => { window.print(); };

  const initializeMap = (day) => {
    const mapElement = document.getElementById(`map-${day.id}`);
    if (!mapElement || !window.google) return;

    const map = new window.google.maps.Map(mapElement, {
      zoom: 13,
      center: day.locations[0]
        ? { lat: day.locations[0].lat, lng: day.locations[0].lng }
        : { lat: tripConfig.coordinates.lat, lng: tripConfig.coordinates.lng }
    });

    const bounds = new window.google.maps.LatLngBounds();

    day.locations.forEach(location => {
      const marker = new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
        title: location.name
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div style="padding: 5px;"><strong>${location.name}</strong><br/>${location.type}</div>`
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      bounds.extend(marker.getPosition());
    });

    if (day.locations.length > 1) {
      map.fitBounds(bounds);
    }
  };

  const handleTranslate = async () => {
    if (!translateFrom.trim()) return;

    setTranslating(true);
    try {
      const [sourceLang, targetLang] = translateDirection === defaultDirection
        ? [translation.sourceLang, translation.targetLang]
        : [translation.targetLang, translation.sourceLang];

      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            q: translateFrom,
            source: sourceLang,
            target: targetLang,
            format: 'text'
          })
        }
      );

      const data = await response.json();
      if (data.data && data.data.translations && data.data.translations[0]) {
        setTranslateTo(data.data.translations[0].translatedText);
      }
    } catch (error) {
      console.error('Translation error:', error);
      setTranslateTo('Translation error. Please try again.');
    }
    setTranslating(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (translateFrom.trim()) {
        handleTranslate();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [translateFrom, translateDirection]);

  const swapLanguages = () => {
    setTranslateDirection(prev => prev === defaultDirection ? reverseDirection : defaultDirection);
    setTranslateFrom(translateTo);
    setTranslateTo(translateFrom);
  };

  const handleHomeChange = (value) => {
    setHomeAmount(value);
    const numValue = parseFloat(value) || 0;
    setLocalAmount((numValue * exchangeRate).toFixed(0));
  };

  const handleLocalChange = (value) => {
    setLocalAmount(value);
    const numValue = parseFloat(value) || 0;
    setHomeAmount((numValue / exchangeRate).toFixed(2));
  };

  const speakText = (text, lang) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const openGoogleLens = () => {
    window.location.href = 'google-lens://';
  };

  const NavLink = ({ id, label }) => (
    <a
      href={`#${id}`}
      onClick={(e) => handleNavClick(e, id)}
      className={`block px-4 py-2 md:inline-block md:px-3 md:py-1 rounded transition-colors ${
        activeSection === id
          ? 'bg-white bg-opacity-20 text-white md:bg-white md:bg-opacity-20'
          : 'text-white hover:bg-white hover:bg-opacity-10'
      }`}
    >
      {label}
    </a>
  );

  const getDayWeather = (date) => {
    const cityWeather = weatherData[tripConfig.city];
    if (!cityWeather || !cityWeather.list) return [];

    const dayWeather = cityWeather.list.filter(item => {
      const itemDate = new Date(item.dt * 1000);
      const itemDateStr = itemDate.toISOString().split('T')[0];
      const itemHour = itemDate.getHours();
      return itemDateStr === date && itemHour >= 10 && itemHour <= 23;
    });

    return dayWeather.slice(0, 5);
  };

  const sidebarProps = {
    tripConfig,
    sidebarTab, setSidebarTab,
    translateFrom, setTranslateFrom,
    translateTo, translateDirection, translating,
    swapLanguages, speakText, copyToClipboard,
    homeAmount, localAmount,
    handleHomeChange, handleLocalChange,
    exchangeRate, rateLoading,
    openGoogleLens, handlePrint
  };

  return (
    <div className="font-serif text-gray-800 bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Playfair+Display:wght@700&display=swap');

        * { scroll-behavior: smooth; }
        body { font-family: 'Merriweather', serif; }
        h1, h2 { font-family: 'Playfair Display', serif; }
        nav, .metadata, .font-lato { font-family: 'Lato', sans-serif; }

        a { color: ${theme.primaryColor}; text-decoration: none; }
        a:hover { color: ${theme.primaryHover}; text-decoration: underline; }

        .btn-primary {
          display: inline-block;
          background-color: ${theme.primaryColor};
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0px;
          font-family: 'Lato', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          transition: background-color 0.2s;
        }
        .btn-primary:hover { background-color: ${theme.primaryHover}; color: white; text-decoration: none; }

        .btn-secondary {
          display: inline-block;
          background-color: ${theme.secondaryColor};
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0px;
          font-family: 'Lato', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          transition: background-color 0.2s;
        }
        .btn-secondary:hover { background-color: ${theme.secondaryHover}; color: white; text-decoration: none; }

        .suggestion-box {
          background-color: #fafafa;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 1.5rem;
          margin: 1.5rem 0;
        }
        .suggestion-box h3 { font-family: 'Playfair Display', serif; font-size: 1.25rem; margin-bottom: 0.75rem; color: #333; }

        .tip-box-sidebar {
          background-color: ${theme.sidebarBg};
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .option-box {
          border-left: 4px solid ${theme.primaryColor};
          background-color: ${theme.accentBg};
          padding: 1.5rem;
          margin: 1.5rem 0;
          border-radius: 4px;
        }

        .weather-widget { display: flex; gap: 0.5rem; overflow-x: auto; padding: 0.5rem 0; }
        .weather-hour { min-width: 80px; text-align: center; padding: 0.5rem; background: white; border: 1px solid #e5e7eb; border-radius: 6px; }
        .map-container { width: 100%; height: 300px; border-radius: 8px; overflow: hidden; margin: 1rem 0; }

        .alternative-option {
          background-color: ${theme.accentBg};
          border-left: 3px solid ${theme.primaryColor};
          padding: 1rem;
          margin-top: 0.75rem;
          border-radius: 4px;
        }

        .day-divider { margin: 4rem 0 3rem; text-align: center; position: relative; }
        .day-divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(to right, transparent, ${theme.primaryColor}, transparent);
        }
        .day-divider-icon {
          display: inline-block;
          background: white;
          padding: 0 1rem;
          position: relative;
          color: ${theme.primaryColor};
          font-size: 1.5rem;
        }

        .section-divider { border: none; height: 1px; background: linear-gradient(to right, transparent, #d1d5db, transparent); margin: 2rem 0; }

        .activity-checkbox { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; margin: 0.5rem 0; border-radius: 4px; transition: background-color 0.2s; }
        .activity-checkbox:hover { background-color: #f9fafb; }
        .activity-checkbox input[type="checkbox"] { width: 1.25rem; height: 1.25rem; cursor: pointer; }
        .activity-checkbox.completed { opacity: 0.6; text-decoration: line-through; }

        @media print {
          nav, header, .back-to-top, aside, footer, .no-print, .activity-checkbox input {
            display: none !important;
          }
          body { color: black !important; background: white !important; }
          a { color: black !important; text-decoration: underline !important; }
          .day-divider { page-break-before: always; }
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 shadow-sm no-print" style={{ backgroundColor: theme.primaryColor, borderBottom: `1px solid ${theme.primaryHover}` }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">{tripConfig.title}</h1>

          <div className="hidden md:flex items-center gap-4">
            {completedDaysCount > 0 && !showAllDays && (
              <div className="text-sm text-white font-lato">
                Day {completedDaysCount + 1} of {days.length}
              </div>
            )}
            {completedDaysCount > 0 && (
              <button
                onClick={() => setShowAllDays(!showAllDays)}
                className="text-xs bg-white bg-opacity-20 text-white px-3 py-1 hover:bg-opacity-30 font-lato"
                style={{ borderRadius: '0px' }}
              >
                {showAllDays ? 'Hide Past Days' : 'Show All Days'}
              </button>
            )}
            <button
              onClick={handlePrint}
              className="text-xs bg-white bg-opacity-20 text-white px-3 py-1 hover:bg-opacity-30 font-lato"
              style={{ borderRadius: '0px' }}
            >
              Export PDF
            </button>
          </div>

          <nav className="hidden md:flex space-x-2 font-lato text-sm items-center">
            {visibleDays.map(day => (
              <NavLink key={day.id} id={day.id} label={`Day ${day.dayNum}`} />
            ))}
            <NavLink id="prep" label="Info" />
          </nav>

          <div className="flex md:hidden items-center gap-2">
            {completedDaysCount > 0 && (
              <button
                onClick={() => setShowAllDays(!showAllDays)}
                className="text-xs text-white px-2 py-1 font-lato bg-white bg-opacity-20 hover:bg-opacity-30"
                style={{ borderRadius: '0px' }}
              >
                {showAllDays ? 'Hide' : 'All'}
              </button>
            )}
            <button
              className="p-2 rounded hover:bg-white hover:bg-opacity-10 text-white"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              aria-label="Tools"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button
              className="p-2 rounded hover:bg-white hover:bg-opacity-10 text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-2 font-lato" style={{ backgroundColor: theme.primaryColor, borderTop: `1px solid ${theme.primaryHover}` }}>
            {visibleDays.map(day => (
              <NavLink key={day.id} id={day.id} label={`Day ${day.dayNum}`} />
            ))}
            <NavLink id="prep" label="Info" />
          </nav>
        )}

        {mobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setMobileSidebarOpen(false)}>
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-4">
                <button
                  className="float-right text-gray-600"
                  onClick={() => setMobileSidebarOpen(false)}
                >
                  ✕
                </button>
                <h2 className="text-2xl font-bold mb-4">Tools & Info</h2>
                <Sidebar {...sidebarProps} />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Banner */}
      <div className="w-full">
        <img
          src={tripConfig.images.banner}
          alt={tripConfig.images.bannerAlt}
          className="w-full h-48 md:h-96 object-cover"
          onError={(e) => {
            e.target.src = `https://placehold.co/1920x600/8B7355/FFFFFF?text=${tripConfig.images.bannerFallback || tripConfig.city}`;
          }}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:grid md:grid-cols-3 md:gap-8">
        <main className="md:col-span-2">
          {tripComplete ? (
            <div className="text-center py-12">
              <h2 className="text-4xl font-bold mb-4">Trip Complete!</h2>
              <p className="text-xl text-gray-600 mb-4">{tripConfig.farewell}</p>
              <button
                onClick={() => setShowAllDays(true)}
                className="text-white px-6 py-2 font-lato"
                style={{ backgroundColor: theme.primaryColor, borderRadius: '0px' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = theme.primaryHover}
                onMouseLeave={(e) => e.target.style.backgroundColor = theme.primaryColor}
              >
                View Full Itinerary
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="font-lato text-sm text-gray-600 mb-2">{tripConfig.dateRange}</p>
                {completedDaysCount > 0 && !showAllDays && (
                  <p className="font-lato text-sm text-amber-700 mb-2">
                    ✓ {completedDaysCount} {completedDaysCount === 1 ? 'day' : 'days'} completed
                  </p>
                )}
                <p className="text-lg">{tripConfig.subtitle}</p>
              </div>

              {visibleDays.map((day, index) => (
                <React.Fragment key={day.id}>
                  {index > 0 && (
                    <div className="day-divider">
                      <span className="day-divider-icon">✦</span>
                    </div>
                  )}
                  <DaySection
                    day={day}
                    weatherData={getDayWeather(day.date)}
                    weatherLoading={weatherLoading}
                    isPast={isDayPast(day.date, tripConfig.timezone)}
                    completedActivities={completedActivities}
                    toggleActivity={toggleActivity}
                    copyToClipboard={copyToClipboard}
                    tripConfig={tripConfig}
                  />
                </React.Fragment>
              ))}
            </>
          )}
        </main>

        <aside id="prep" className="hidden md:block md:col-span-1">
          <div className="sticky top-24">
            <Sidebar {...sidebarProps} />
          </div>
        </aside>
      </div>

      <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-600 no-print">
        <p>{tripConfig.footer}</p>
      </footer>

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 text-white p-3 shadow-lg transition-all duration-300 z-50 no-print"
          style={{ backgroundColor: theme.primaryColor, borderRadius: '0px' }}
          aria-label="Back to top"
          onMouseEnter={(e) => e.target.style.backgroundColor = theme.primaryHover}
          onMouseLeave={(e) => e.target.style.backgroundColor = theme.primaryColor}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
}
