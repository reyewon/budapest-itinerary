import React, { useState, useEffect } from 'react';

// API Keys
const GOOGLE_TRANSLATE_API_KEY = 'AIzaSyDbslFWVHP3f8D42vJ5Uh1RwBJk13FRaes';
const GOOGLE_MAPS_API_KEY = 'AIzaSyDbslFWVHP3f8D42vJ5Uh1RwBJk13FRaes';
const OPENWEATHER_API_KEY = 'a023fe2b6ae44cff706475967ab7c7c6';

// Image URLs
const IMAGES = {
  banner: 'https://media.cntraveller.com/photos/673763550788484ddcc59ca0/3:2/w_8190,h_5460,c_limit/Hungary-Budapest-GettyImages-2156020912.jpeg',
  gozsdu: 'https://travelprnews.com/wp-content/uploads/2018/12/unnamed-6.jpg',
  parliament: 'https://assets.bucketlistly.blog/sites/5adf778b6eabcc00190b75b1/content_entry5adf77af6eabcc00190b75b6/5ae464628eaf2a001938afc1/files/budapest-one-day-guide-main-image-hd-op.webp',
  fisherman: 'https://www.rjontour.com/wp-content/uploads/2024/08/Early-Morning-at-Fishermans-Bastion.jpg',
  buda: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/e4/b1/d2/caption.jpg?w=1200&h=-1&s=1&cx=3510&cy=2343&chk=v1_7fb25476f22ec2fdc752',
  szentendre: 'https://pohcdn.com/sites/default/files/styles/paragraph__live_banner__lb_image__1880bp/public/live_banner/Szentendre.jpg',
  liberty: 'https://welovebudapest.com/i/7a/november-2019-csudai-sandor-0006.exact1980w.jpg'
};

// Budapest restaurant/bar alternatives
const alternatives = {
  'Fricska 2.0': {
    name: 'Dobrumba',
    address: 'Dob utca 5',
    why: 'Stylish Levantine, comfortable seating with aromatic share plates.',
    dishes: 'Lamb shawarma, mezze platters.',
    prices: 'Mains ~3,500-6,000 HUF'
  },
  'Boutiq\'Bar': {
    name: 'Tuk Tuk Bar',
    address: 'Hold utca 5',
    why: 'Travel vibe with edge, balanced crowd, tight cocktail builds.',
    drinks: 'Penang Mule, Bangkok Nights.',
    prices: 'Cocktails ~3,500-4,500 HUF'
  },
  'Café Kör': {
    name: 'Két Szerecsen',
    address: 'Nagymező utca 14',
    why: 'Stylish bistro done right, duck breast and seafood risotto.',
    dishes: 'Duck breast, veal paprikash.',
    prices: 'Mains ~4,500-7,500 HUF'
  },
  'Rosenstein Vendéglő': {
    name: 'Pest-Buda Bistro',
    address: 'Fortuna utca 3',
    why: 'Castle district comfort with warm service and intimate room.',
    dishes: 'Chicken paprikash, goulash.',
    prices: 'Mains ~4,000-7,000 HUF'
  },
  'Pest-Buda Bistro': {
    name: 'Café Kör',
    address: 'Sas utca 17',
    why: 'Old-world Pest, civilised, bookable, dependable classic.',
    dishes: 'Veal paprikash, classic Hungarian dishes.',
    prices: 'Mains ~4,500-8,000 HUF'
  },
  'Két Szerecsen': {
    name: 'Dobrumba',
    address: 'Dob utca 5',
    why: 'Levantine aromatic plates in stylish setting.',
    dishes: 'Lamb dishes, share plates.',
    prices: 'Mains ~3,500-6,000 HUF'
  },
  'Hotsy Totsy Budapest': {
    name: 'Boutiq\'Bar',
    address: 'Paulay Ede utca 5',
    why: 'Benchmark mixing, moody room, serious drinks.',
    drinks: 'Basil Smash, Smoked Old Fashioned.',
    prices: 'Cocktails ~3,500-5,000 HUF'
  },
  'Tuk Tuk Bar': {
    name: 'Hotsy Totsy Budapest',
    address: 'Nagymező utca 8',
    why: 'Vinyl, low light, crafted classics with edge.',
    drinks: 'New York Sour, classic cocktails.',
    prices: 'Cocktails ~3,500-4,800 HUF'
  }
};

// Itinerary Data for Budapest
const itineraryDays = [
  {
    id: 'day1',
    dayNum: 1,
    date: '2025-11-17',
    title: 'Arrival & First Evening Photowalk',
    city: 'Budapest',
    locations: [
      { name: 'Klauzál tér', lat: 47.4959, lng: 19.0625, type: 'accommodation', address: 'Klauzál tér 6, 1072 Budapest' },
      { name: 'Gozsdu Passage', lat: 47.4970, lng: 19.0605, type: 'attraction', address: 'Dob utca, Budapest' },
      { name: 'Fricska 2.0', lat: 47.4950, lng: 19.0638, type: 'restaurant', address: 'District VII, Budapest' },
      { name: 'Boutiq\'Bar', lat: 47.4985, lng: 19.0580, type: 'bar', address: 'Paulay Ede utca 5, Budapest' }
    ],
    activities: [
      { id: 'day1-airport', name: 'Airport transfer to accommodation' },
      { id: 'day1-photowalk', name: 'Evening photowalk (Klauzál tér → Gozsdu)' },
      { id: 'day1-dinner', name: 'Dinner at Fricska 2.0' },
      { id: 'day1-cocktails', name: 'Cocktails at Boutiq\'Bar' }
    ]
  },
  {
    id: 'day2',
    dayNum: 2,
    date: '2025-11-18',
    title: 'Parliament Edges & Danube Light',
    city: 'Budapest',
    locations: [
      { name: 'Klauzál Market', lat: 47.4961, lng: 19.0627, type: 'attraction', address: 'Klauzál tér, Budapest' },
      { name: 'Café Kör', lat: 47.5005, lng: 19.0515, type: 'restaurant', address: 'Sas utca 17, Budapest' },
      { name: 'Parliament Building', lat: 47.5076, lng: 19.0458, type: 'attraction', address: 'Kossuth Lajos tér, Budapest' },
      { name: 'Rosenstein Vendéglő', lat: 47.4810, lng: 19.0921, type: 'restaurant', address: 'Mosonyi utca 3, Budapest' },
      { name: 'Hotsy Totsy Budapest', lat: 47.5025, lng: 19.0621, type: 'bar', address: 'Nagymező utca 8, Budapest' }
    ],
    activities: [
      { id: 'day2-market', name: 'Klauzál Market and nearby lanes' },
      { id: 'day2-lunch', name: 'Lunch at Café Kör' },
      { id: 'day2-lipotvaros', name: 'Lipótváros grid to Kossuth Lajos tér' },
      { id: 'day2-goldenhour', name: 'Golden hour: Pest embankment' },
      { id: 'day2-dinner', name: 'Dinner at Rosenstein Vendéglő' },
      { id: 'day2-cocktails', name: 'Cocktails at Hotsy Totsy' }
    ]
  },
  {
    id: 'day3',
    dayNum: 3,
    date: '2025-11-19',
    title: 'Buda Streets, Viewpoints & Steam',
    city: 'Budapest',
    locations: [
      { name: 'Batthyány tér', lat: 47.5067, lng: 19.0374, type: 'station', address: 'Batthyány tér, Budapest' },
      { name: 'Fisherman\'s Bastion', lat: 47.5025, lng: 19.0345, type: 'attraction', address: 'Szentháromság tér, Budapest' },
      { name: 'Pest-Buda Bistro', lat: 47.5014, lng: 19.0339, type: 'restaurant', address: 'Fortuna utca 3, Budapest' },
      { name: 'Rudas Baths', lat: 47.4878, lng: 19.0522, type: 'spa', address: 'Döbrentei tér 9, Budapest' },
      { name: 'Két Szerecsen', lat: 47.5030, lng: 19.0595, type: 'restaurant', address: 'Nagymező utca 14, Budapest' },
      { name: 'Tuk Tuk Bar', lat: 47.5015, lng: 19.0525, type: 'bar', address: 'Hold utca 5, Budapest' }
    ],
    activities: [
      { id: 'day3-buda', name: 'Metro to Batthyány tér, Fő utca lanes' },
      { id: 'day3-bastion', name: 'Fisherman\'s Bastion quiet paths' },
      { id: 'day3-lunch', name: 'Lunch at Pest-Buda Bistro' },
      { id: 'day3-goldenhour', name: 'Golden hour: Buda embankment' },
      { id: 'day3-baths', name: 'Thermal soak at Rudas or Veli Bej' },
      { id: 'day3-dinner', name: 'Dinner at Két Szerecsen' },
      { id: 'day3-cocktails', name: 'Cocktails at Tuk Tuk Bar' }
    ]
  },
  {
    id: 'day4',
    dayNum: 4,
    date: '2025-11-20',
    title: 'Day Trip: Szentendre or Vác',
    city: 'Budapest',
    locations: [
      { name: 'Batthyány tér (HÉV H5)', lat: 47.5067, lng: 19.0374, type: 'station', address: 'Batthyány tér, Budapest' },
      { name: 'Szentendre', lat: 47.6686, lng: 19.0751, type: 'attraction', address: 'Szentendre, Hungary' },
      { name: 'Liberty Bridge', lat: 47.4876, lng: 19.0543, type: 'attraction', address: 'Szabadság híd, Budapest' },
      { name: 'Chain Bridge', lat: 47.4984, lng: 19.0435, type: 'attraction', address: 'Széchenyi lánchíd, Budapest' }
    ],
    activities: [
      { id: 'day4-daytrip', name: 'Day trip to Szentendre (or Vác if bad weather)' },
      { id: 'day4-lunch', name: 'Lunch at Aranysárkány Vendéglő' },
      { id: 'day4-return', name: 'Return to Pest for blue hour' },
      { id: 'day4-bridges', name: 'Liberty Bridge and Chain Bridge silhouettes' },
      { id: 'day4-dinner', name: 'Dinner at Fricska 2.0 or Rosenstein' },
      { id: 'day4-cocktails', name: 'Final cocktail at Boutiq\'Bar' }
    ]
  },
  {
    id: 'day5',
    dayNum: 5,
    date: '2025-11-21',
    title: 'Departure Morning',
    city: 'Budapest',
    locations: [
      { name: 'Deák Ferenc tér', lat: 47.4970, lng: 19.0545, type: 'station', address: 'Deák Ferenc tér, Budapest' },
      { name: 'Budapest Airport', lat: 47.4367, lng: 19.2556, type: 'airport', address: 'BUD, Terminal 2' }
    ],
    activities: [
      { id: 'day5-checkout', name: 'Check out by 10:00' },
      { id: 'day5-transfer', name: '100E to airport (leave ~07:50)' },
      { id: 'day5-flight', name: 'easyJet U28732 departure 10:25' }
    ]
  }
];

// Utility functions
const getHungarianDate = () => {
  const now = new Date();
  const budapestTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Budapest' }));
  return budapestTime.toISOString().split('T')[0];
};

const isDayPast = (dayDate) => {
  const currentDate = getHungarianDate();
  return dayDate < currentDate;
};

export default function BudapestItinerary() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState('day1');
  const [sidebarTab, setSidebarTab] = useState('tools');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showAllDays, setShowAllDays] = useState(false);
  
  const [weatherData, setWeatherData] = useState({});
  const [weatherLoading, setWeatherLoading] = useState(true);
  
  const [translateFrom, setTranslateFrom] = useState('');
  const [translateTo, setTranslateTo] = useState('');
  const [translating, setTranslating] = useState(false);
  const [translateDirection, setTranslateDirection] = useState('en-hu');
  
  const [gbpAmount, setGbpAmount] = useState('100');
  const [hufAmount, setHufAmount] = useState('45000');
  const [exchangeRate, setExchangeRate] = useState(450);
  const [rateLoading, setRateLoading] = useState(true);
  
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [completedActivities, setCompletedActivities] = useState(() => {
    const saved = localStorage.getItem('completedActivities');
    return saved ? JSON.parse(saved) : {};
  });

  const visibleDays = showAllDays ? itineraryDays : itineraryDays.filter(day => !isDayPast(day.date));
  const completedDaysCount = itineraryDays.length - itineraryDays.filter(day => !isDayPast(day.date)).length;
  const tripComplete = visibleDays.length === 0 && !showAllDays;

  // Fetch real exchange rate
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/GBP');
        const data = await response.json();
        if (data.rates && data.rates.HUF) {
          setExchangeRate(data.rates.HUF);
          setHufAmount((parseFloat(gbpAmount) * data.rates.HUF).toFixed(0));
        }
        setRateLoading(false);
      } catch (error) {
        console.error('Exchange rate fetch error:', error);
        setRateLoading(false);
      }
    };
    fetchExchangeRate();
  }, []);

  // Save completed activities
  useEffect(() => {
    localStorage.setItem('completedActivities', JSON.stringify(completedActivities));
  }, [completedActivities]);

  // Register service worker for offline
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.log('Service worker registration failed:', err);
      });
    }
  }, []);

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
          `https://api.openweathermap.org/data/2.5/forecast?lat=47.4979&lon=19.0402&appid=${OPENWEATHER_API_KEY}&units=metric`
        );
        const data = await response.json();
        setWeatherData({ Budapest: data });
        setWeatherLoading(false);
      } catch (error) {
        console.error('Weather fetch error:', error);
        setWeatherLoading(false);
      }
    };
    fetchWeather();
  }, []);

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

  const handlePrint = () => {
    window.print();
  };

  const initializeMap = (day) => {
    const mapElement = document.getElementById(`map-${day.id}`);
    if (!mapElement || !window.google) return;

    const map = new window.google.maps.Map(mapElement, {
      zoom: 13,
      center: day.locations[0] ? { lat: day.locations[0].lat, lng: day.locations[0].lng } : { lat: 47.4979, lng: 19.0402 }
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
      const [sourceLang, targetLang] = translateDirection === 'en-hu' ? ['en', 'hu'] : ['hu', 'en'];
      
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
    setTranslateDirection(prev => prev === 'en-hu' ? 'hu-en' : 'en-hu');
    setTranslateFrom(translateTo);
    setTranslateTo(translateFrom);
  };

  const handleGbpChange = (value) => {
    setGbpAmount(value);
    const numValue = parseFloat(value) || 0;
    setHufAmount((numValue * exchangeRate).toFixed(0));
  };

  const handleHufChange = (value) => {
    setHufAmount(value);
    const numValue = parseFloat(value) || 0;
    setGbpAmount((numValue / exchangeRate).toFixed(2));
  };

  const speakText = (text, lang) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'hu' ? 'hu-HU' : 'en-GB';
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
    if (!weatherData.Budapest || !weatherData.Budapest.list) return [];
    
    const dayWeather = weatherData.Budapest.list.filter(item => {
      const itemDate = new Date(item.dt * 1000);
      const itemDateStr = itemDate.toISOString().split('T')[0];
      const itemHour = itemDate.getHours();
      return itemDateStr === date && itemHour >= 10 && itemHour <= 23;
    });
    
    return dayWeather.slice(0, 5);
  };

  return (
    <div className="font-serif text-gray-800 bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Playfair+Display:wght@700&display=swap');
        
        * { scroll-behavior: smooth; }
        body { font-family: 'Merriweather', serif; }
        h1, h2 { font-family: 'Playfair Display', serif; }
        nav, .metadata, .font-lato { font-family: 'Lato', sans-serif; }
        
        a { color: #DE7356; text-decoration: none; }
        a:hover { color: #CC6545; text-decoration: underline; }
        
        .btn-primary {
          display: inline-block;
          background-color: #DE7356;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0px;
          font-family: 'Lato', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          transition: background-color 0.2s;
        }
        
        .btn-primary:hover {
          background-color: #CC6545;
          color: white;
          text-decoration: none;
        }
        
        .btn-secondary {
          display: inline-block;
          background-color: #A0522D;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0px;
          font-family: 'Lato', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          transition: background-color 0.2s;
        }
        
        .btn-secondary:hover {
          background-color: #8B4513;
          color: white;
          text-decoration: none;
        }
        
        .suggestion-box {
          background-color: #fafafa;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 1.5rem;
          margin: 1.5rem 0;
        }
        
        .suggestion-box h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          margin-bottom: 0.75rem;
          color: #333;
        }
        
        .tip-box-sidebar {
          background-color: #f8f7f2;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 1.25rem;
          margin-bottom: 1.5rem;
        }
        
        .option-box {
          border-left: 4px solid #DE7356;
          background-color: #FCEBE6;
          padding: 1.5rem;
          margin: 1.5rem 0;
          border-radius: 4px;
        }
        
        .weather-widget {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding: 0.5rem 0;
        }
        
        .weather-hour {
          min-width: 80px;
          text-align: center;
          padding: 0.5rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
        }
        
        .map-container {
          width: 100%;
          height: 300px;
          border-radius: 8px;
          overflow: hidden;
          margin: 1rem 0;
        }
        
        .alternative-option {
          background-color: #FCEBE6;
          border-left: 3px solid #DE7356;
          padding: 1rem;
          margin-top: 0.75rem;
          border-radius: 4px;
        }
        
        .day-divider {
          margin: 4rem 0 3rem;
          text-align: center;
          position: relative;
        }
        
        .day-divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(to right, transparent, #DE7356, transparent);
        }
        
        .day-divider-icon {
          display: inline-block;
          background: white;
          padding: 0 1rem;
          position: relative;
          color: #DE7356;
          font-size: 1.5rem;
        }
        
        .section-divider {
          border: none;
          height: 1px;
          background: linear-gradient(to right, transparent, #d1d5db, transparent);
          margin: 2rem 0;
        }
        
        .activity-checkbox {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 4px;
          transition: background-color 0.2s;
        }
        
        .activity-checkbox:hover {
          background-color: #f9fafb;
        }
        
        .activity-checkbox input[type="checkbox"] {
          width: 1.25rem;
          height: 1.25rem;
          cursor: pointer;
        }
        
        .activity-checkbox.completed {
          opacity: 0.6;
          text-decoration: line-through;
        }
        
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
      <header className="sticky top-0 z-50 shadow-sm no-print" style={{ backgroundColor: '#DE7356', borderBottom: '1px solid #CC6545' }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Budapest, 17-21 Nov 2025</h1>
          
          <div className="hidden md:flex items-center gap-4">
            {completedDaysCount > 0 && !showAllDays && (
              <div className="text-sm text-white font-lato">
                Day {completedDaysCount + 1} of 5
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
          <nav className="md:hidden py-2 font-lato" style={{ backgroundColor: '#DE7356', borderTop: '1px solid #CC6545' }}>
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
                
                <SidebarContent 
                  sidebarTab={sidebarTab}
                  setSidebarTab={setSidebarTab}
                  translateFrom={translateFrom}
                  setTranslateFrom={setTranslateFrom}
                  translateTo={translateTo}
                  translateDirection={translateDirection}
                  translating={translating}
                  swapLanguages={swapLanguages}
                  speakText={speakText}
                  copyToClipboard={copyToClipboard}
                  gbpAmount={gbpAmount}
                  hufAmount={hufAmount}
                  handleGbpChange={handleGbpChange}
                  handleHufChange={handleHufChange}
                  exchangeRate={exchangeRate}
                  rateLoading={rateLoading}
                  openGoogleLens={openGoogleLens}
                  handlePrint={handlePrint}
                />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Banner */}
      <div className="w-full">
        <img
          src={IMAGES.banner}
          alt="Budapest Parliament from Pest embankment at golden hour"
          className="w-full h-48 md:h-96 object-cover"
          onError={(e) => {
            e.target.src = 'https://placehold.co/1920x600/8B7355/FFFFFF?text=Budapest+Parliament';
          }}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:grid md:grid-cols-3 md:gap-8">
        
        <main className="md:col-span-2">
          {tripComplete ? (
            <div className="text-center py-12">
              <h2 className="text-4xl font-bold mb-4">Trip Complete!</h2>
              <p className="text-xl text-gray-600 mb-4">Hope you had an amazing time in Budapest, Ryan!</p>
              <button
                onClick={() => setShowAllDays(true)}
                className="text-white px-6 py-2 font-lato"
                style={{ backgroundColor: '#DE7356', borderRadius: '0px' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#CC6545'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#DE7356'}
              >
                View Full Itinerary
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="font-lato text-sm text-gray-600 mb-2">Monday 17th - Friday 21st November, 2025</p>
                {completedDaysCount > 0 && !showAllDays && (
                  <p className="font-lato text-sm text-amber-700 mb-2">
                    ✓ {completedDaysCount} {completedDaysCount === 1 ? 'day' : 'days'} completed
                  </p>
                )}
                <p className="text-lg">A long weekend exploring Budapest's backstreets, thermal baths, and golden hour along the Danube.</p>
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
                    isPast={isDayPast(day.date)}
                    completedActivities={completedActivities}
                    toggleActivity={toggleActivity}
                    copyToClipboard={copyToClipboard}
                    images={IMAGES}
                  />
                </React.Fragment>
              ))}
            </>
          )}
        </main>

        <aside id="prep" className="hidden md:block md:col-span-1">
          <div className="sticky top-24">
            <SidebarContent 
              sidebarTab={sidebarTab}
              setSidebarTab={setSidebarTab}
              translateFrom={translateFrom}
              setTranslateFrom={setTranslateFrom}
              translateTo={translateTo}
              translateDirection={translateDirection}
              translating={translating}
              swapLanguages={swapLanguages}
              speakText={speakText}
              copyToClipboard={copyToClipboard}
              gbpAmount={gbpAmount}
              hufAmount={hufAmount}
              handleGbpChange={handleGbpChange}
              handleHufChange={handleHufChange}
              exchangeRate={exchangeRate}
              rateLoading={rateLoading}
              openGoogleLens={openGoogleLens}
              handlePrint={handlePrint}
            />
          </div>
        </aside>
      </div>

      <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-600 no-print">
        <p>Have an amazing trip to Budapest!</p>
      </footer>

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 text-white p-3 shadow-lg transition-all duration-300 z-50 no-print"
          style={{ backgroundColor: '#DE7356', borderRadius: '0px' }}
          aria-label="Back to top"
          onMouseEnter={(e) => e.target.style.backgroundColor = '#CC6545'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#DE7356'}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
}

function SidebarContent(props) {
  const { sidebarTab, setSidebarTab, translateFrom, setTranslateFrom, translateTo, translateDirection,
    translating, swapLanguages, speakText, copyToClipboard, gbpAmount, hufAmount,
    handleGbpChange, handleHufChange, exchangeRate, rateLoading, openGoogleLens, handlePrint } = props;

  return (
    <>
      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`px-4 py-2 font-lato text-sm ${sidebarTab === 'tools' ? 'border-b-2 text-white' : 'text-gray-600'}`}
          style={{ borderBottomColor: sidebarTab === 'tools' ? '#DE7356' : 'transparent', backgroundColor: sidebarTab === 'tools' ? '#DE7356' : 'transparent' }}
          onClick={() => setSidebarTab('tools')}
        >
          Tools
        </button>
        <button
          className={`px-4 py-2 font-lato text-sm ${sidebarTab === 'essentials' ? 'border-b-2 text-white' : 'text-gray-600'}`}
          style={{ borderBottomColor: sidebarTab === 'essentials' ? '#DE7356' : 'transparent', backgroundColor: sidebarTab === 'essentials' ? '#DE7356' : 'transparent' }}
          onClick={() => setSidebarTab('essentials')}
        >
          Essentials
        </button>
        <button
          className={`px-4 py-2 font-lato text-sm ${sidebarTab === 'travel' ? 'border-b-2 text-white' : 'text-gray-600'}`}
          style={{ borderBottomColor: sidebarTab === 'travel' ? '#DE7356' : 'transparent', backgroundColor: sidebarTab === 'travel' ? '#DE7356' : 'transparent' }}
          onClick={() => setSidebarTab('travel')}
        >
          Travel
        </button>
      </div>

      {sidebarTab === 'tools' && (
        <>
          <div className="tip-box-sidebar">
            <h3 className="text-lg font-bold mb-3">Translator</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-lato">{translateDirection === 'en-hu' ? 'English → Hungarian' : 'Hungarian → English'}</span>
                <button onClick={swapLanguages} className="text-amber-700 hover:text-amber-800">⇄</button>
              </div>
              <textarea
                value={translateFrom}
                onChange={(e) => setTranslateFrom(e.target.value)}
                placeholder={translateDirection === 'en-hu' ? 'Type in English...' : 'Írj magyarul...'}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                rows="3"
              />
              <div className="relative">
                <textarea
                  value={translateTo}
                  readOnly
                  placeholder={translating ? 'Translating...' : 'Translation appears here...'}
                  className="w-full p-2 border border-gray-300 rounded text-sm bg-gray-50"
                  rows="3"
                />
                {translateTo && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => speakText(translateTo, translateDirection === 'en-hu' ? 'hu' : 'en')}
                      className="text-xs text-white px-3 py-1"
                      style={{ backgroundColor: '#DE7356', borderRadius: '0px' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#CC6545'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#DE7356'}
                    >
                      Speak
                    </button>
                    <button
                      onClick={() => copyToClipboard(translateTo)}
                      className="text-xs bg-gray-600 text-white px-3 py-1 hover:bg-gray-700"
                      style={{ borderRadius: '0px' }}
                    >
                      Copy
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-3 text-xs text-gray-600">
                <p className="font-bold mb-1">Common phrases:</p>
                <p>Szia (Hello) • Köszönöm (Thank you) • Mennyibe kerül? (How much?)</p>
              </div>
            </div>
          </div>

          <div className="tip-box-sidebar">
            <h3 className="text-lg font-bold mb-3">Currency Converter</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-lato text-gray-700">GBP (£)</label>
                <input
                  type="number"
                  value={gbpAmount}
                  onChange={(e) => handleGbpChange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="text-center text-gray-500">
                <span className="text-xs">
                  {rateLoading ? 'Loading rate...' : `1 GBP = ${exchangeRate.toFixed(2)} HUF`}
                </span>
              </div>
              <div>
                <label className="text-sm font-lato text-gray-700">HUF (Ft)</label>
                <input
                  type="number"
                  value={hufAmount}
                  onChange={(e) => handleHufChange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </div>

          <div className="tip-box-sidebar">
            <h3 className="text-lg font-bold mb-3">Export</h3>
            <button
              onClick={handlePrint}
              className="w-full text-white py-2 px-4 font-lato"
              style={{ backgroundColor: '#DE7356', borderRadius: '0px' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#CC6545'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#DE7356'}
            >
              Export to PDF
            </button>
            <p className="text-xs text-gray-600 mt-2">Save or print your itinerary</p>
          </div>

          <div className="md:hidden tip-box-sidebar">
            <h3 className="text-lg font-bold mb-3">Google Lens</h3>
            <button
              onClick={openGoogleLens}
              className="w-full text-white py-2 px-4"
              style={{ backgroundColor: '#DE7356', borderRadius: '0px' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#CC6545'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#DE7356'}
            >
              Open Google Lens
            </button>
            <p className="text-xs text-gray-600 mt-2">Translate signs, menus and more</p>
          </div>
        </>
      )}

      {sidebarTab === 'essentials' && (
        <>
          <div className="tip-box-sidebar">
            <h3 className="text-lg font-bold mb-2">Weather in November</h3>
            <p className="text-sm">Budapest: Short daylight, golden hour around 16:00. Chilly single digits, near-freezing nights, possible showers and wind. Pack layers.</p>
          </div>
          <div className="tip-box-sidebar">
            <h3 className="text-lg font-bold mb-2">Packing Essentials</h3>
            <p className="text-sm">Layers over bulk, compact umbrella, scarf and beanie, light gloves, trainers with grip for damp cobbles, microfibre towel for baths, spare phone battery for the cold.</p>
          </div>
          <div className="tip-box-sidebar">
            <h3 className="text-lg font-bold mb-2">Accommodation</h3>
            <p className="text-sm mb-2"><strong>Budapest:</strong> <a href="https://www.google.com/search?q=Klauzal+ter+6+Budapest" target="_blank" rel="noopener noreferrer">Bright Loft, Klauzál tér 6, 1072</a></p>
            <p className="text-sm">Check-in from 15:00 on 17 Nov; check-out by 10:00 on 21 Nov. Self check-in via lockbox.</p>
          </div>
        </>
      )}

      {sidebarTab === 'travel' && (
        <>
          <div className="tip-box-sidebar">
            <h3 className="text-lg font-bold mb-2">Flights</h3>
            <p className="text-sm mb-2"><strong>Outbound:</strong> Wizz Air W6 2222, LGW → BUD, Mon 17 Nov, 09:20 → 12:45</p>
            <p className="text-sm"><strong>Return:</strong> easyJet U28732, BUD → LGW, Fri 21 Nov, 10:25 → 12:15</p>
          </div>
          <div className="tip-box-sidebar">
            <h3 className="text-lg font-bold mb-2">Airport Transfer</h3>
            <p className="text-sm mb-2"><strong>100E Airport Express:</strong> Terminal 2 to Deák Ferenc tér, approx 2,200 HUF. Buy on BudapestGO app or BKK machines.</p>
            <p className="text-sm">Special 100E single ticket only, not valid on other lines. Allow 90 mins buffer at BUD.</p>
          </div>
          <div className="tip-box-sidebar">
            <h3 className="text-lg font-bold mb-2">Getting Around</h3>
            <p className="text-sm mb-2">Walking, metro, trams, official airport buses only.</p>
            <p className="text-sm">Use <strong>BudapestGO</strong> app for tickets and journey planning. HÉV H5 to Szentendre needs suburban add-on beyond city limits.</p>
          </div>
        </>
      )}
    </>
  );
}

function DaySection({ day, weatherData, weatherLoading, isPast, completedActivities, toggleActivity, copyToClipboard, images }) {
  return (
    <section id={day.id} className={`mb-12 ${isPast ? 'opacity-70' : ''}`}>
      <h2 className="text-4xl md:text-5xl font-bold mb-2 inline-block text-white px-4 py-2" style={{ backgroundColor: '#DE7356' }}>
        Day {day.dayNum}
      </h2>
      <h3 className="text-2xl md:text-3xl text-gray-700 mb-4">{day.title}</h3>
      <p className="font-lato text-sm text-gray-600 mb-2">
        {new Date(day.date + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
      </p>
      
      {!weatherLoading && weatherData.length > 0 && (
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
      )}
      
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
      
      <DayContent day={day} copyToClipboard={copyToClipboard} images={images} />
    </section>
  );
}

function VenueWithAlternative({ venueName, children, copyToClipboard, address }) {
  const [showAlt, setShowAlt] = useState(false);
  const alt = alternatives[venueName];
  
  return (
    <div>
      {children}
      {address && (
        <button
          onClick={() => copyToClipboard(address)}
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
            style={{ backgroundColor: showAlt ? '#A0522D' : '#DE7356', borderRadius: '0px' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = showAlt ? '#8B4513' : '#CC6545'}
            onMouseLeave={(e) => e.target.style.backgroundColor = showAlt ? '#A0522D' : '#DE7356'}
          >
            {showAlt ? '- Hide' : '+ Show'} Alternative Option
          </button>
          {showAlt && (
            <div className="alternative-option">
              <p className="text-sm font-bold mb-1">{alt.name}</p>
              <p className="text-xs text-gray-600 mb-2">
                <a href={`https://www.google.com/search?q=${alt.name}+${alt.address}+Budapest`} target="_blank" rel="noopener noreferrer">
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

function DayContent({ day, copyToClipboard, images }) {
  if (day.dayNum === 1) {
    return (
      <div className="space-y-4">
        <img
          src={images.gozsdu}
          alt="Gozsdu passages neon reflections"
          className="w-full rounded-lg my-6"
          onError={(e) => {
            e.target.src = 'https://placehold.co/1080x607/8B7355/FFFFFF?text=Gozsdu+Passage';
          }}
        />
        
        <p><strong>Airport → Klauzál tér 6</strong></p>
        <p>Route: <strong>100E Airport Express</strong> to <strong>Deák Ferenc tér</strong> then walk about 12 mins to the door. Use the 100E single ticket. If rain is heavy, allow 5 extra mins for slower pavements.</p>
        
        <hr className="section-divider" />
        
        <p><strong>Relaxed first evening photowalk</strong></p>
        <p>Loop: Klauzál tér → Rákóczi út side streets → Király utca textures → Gozsdu passages neon → Kazinczy utca murals → home.</p>
        <p className="text-sm italic">Wet-weather swap: Budapest Pinball Museum for late opening and warm indoor atmosphere.</p>
        <p className="text-sm font-lato text-gray-600">Daily walking estimate: 5-6 km</p>
        
        <hr className="section-divider" />
        
        <VenueWithAlternative venueName="Fricska 2.0" copyToClipboard={copyToClipboard} address="District VII, Budapest">
          <div className="suggestion-box">
            <h3>Dinner at Fricska 2.0</h3>
            <p className="font-lato text-sm text-gray-600 mb-2">19:30 • <a href="https://www.google.com/search?q=Fricska+2.0+Budapest" target="_blank" rel="noopener noreferrer">District VII</a></p>
            <p><strong>Why it fits you:</strong> Modern Hungarian bistro, polished but not pretentious, near base. Duck leg with red cabbage is exceptional.</p>
            <p><strong>Rating:</strong> Google 4.6</p>
            <p><strong>Prices:</strong> Mains approximately 4,500-7,500 HUF (£10-£17).</p>
          </div>
        </VenueWithAlternative>
        
        <VenueWithAlternative venueName="Boutiq'Bar" copyToClipboard={copyToClipboard} address="Paulay Ede utca 5, Budapest">
          <div className="suggestion-box">
            <h3>Cocktails at Boutiq'Bar</h3>
            <p className="font-lato text-sm text-gray-600 mb-2">21:30 • <a href="https://www.google.com/search?q=Boutiq+Bar+Budapest" target="_blank" rel="noopener noreferrer">Paulay Ede utca 5</a></p>
            <p><strong>Why it fits you:</strong> Benchmark mixing, moody room, serious drinks, proper seating. Try a Basil Smash.</p>
            <p><strong>Drinks:</strong> Cocktails 3,500-5,000 HUF (£8-£11).</p>
          </div>
        </VenueWithAlternative>
      </div>
    );
  }
  
  if (day.dayNum === 2) {
    return (
      <div className="space-y-4">
        <img
          src={images.parliament}
          alt="Parliament from Pest embankment at golden hour"
          className="w-full rounded-lg my-6"
          onError={(e) => {
            e.target.src = 'https://placehold.co/1080x607/8B7355/FFFFFF?text=Parliament+View';
          }}
        />
        
        <p><strong>10:30</strong> Klauzál Market and nearby lanes for local life and textures.</p>
        <p className="text-sm italic">Wet swap: House of Music Hungary foyer and interior forms.</p>
        
        <hr className="section-divider" />
        
        <VenueWithAlternative venueName="Café Kör" copyToClipboard={copyToClipboard} address="Sas utca 17, Budapest">
          <div className="suggestion-box">
            <h3>Lunch near Basilica at Café Kör</h3>
            <p className="font-lato text-sm text-gray-600 mb-2">12:30 • <a href="https://www.google.com/search?q=Cafe+Kor+Budapest" target="_blank" rel="noopener noreferrer">Sas utca 17</a></p>
            <p><strong>Why it fits you:</strong> Old-world, civilised, bookable. Veal paprikash is excellent.</p>
            <p><strong>Rating:</strong> Google 4.6</p>
            <p><strong>Prices:</strong> Mains 4,500-8,000 HUF (£10-£18).</p>
          </div>
        </VenueWithAlternative>
        
        <hr className="section-divider" />
        
        <p><strong>14:00</strong> Lipótváros grid to <strong>Kossuth Lajos tér</strong> with <strong>Szabadság tér</strong> and Hold utca facades.</p>
        <p className="text-sm italic">Wet swap: Parliament interior tour if available that afternoon.</p>
        
        <p><strong>15:30-16:45 Golden hour</strong></p>
        <p>Pest embankment north of Parliament and <strong>Margit híd</strong> perspectives.</p>
        <p className="text-sm italic">Wet swap: Budapest Pinball Museum pre-dinner warm-up.</p>
        
        <hr className="section-divider" />
        
        <VenueWithAlternative venueName="Rosenstein Vendéglő" copyToClipboard={copyToClipboard} address="Mosonyi utca 3, Budapest">
          <div className="suggestion-box">
            <h3>Dinner at Rosenstein Vendéglő</h3>
            <p className="font-lato text-sm text-gray-600 mb-2">19:30 • <a href="https://www.google.com/search?q=Rosenstein+Vendegl%C5%91+Budapest" target="_blank" rel="noopener noreferrer">Mosonyi utca 3</a></p>
            <p><strong>Why it fits you:</strong> Hungarian-Jewish family institution with depth and genuine hospitality. Goose liver or cholent are standouts.</p>
            <p><strong>Rating:</strong> Approximately 4.6</p>
            <p><strong>Prices:</strong> Mains 5,000-9,000 HUF (£11-£20).</p>
          </div>
        </VenueWithAlternative>
        
        <VenueWithAlternative venueName="Hotsy Totsy Budapest" copyToClipboard={copyToClipboard} address="Nagymező utca 8, Budapest">
          <div className="suggestion-box">
            <h3>Cocktails at Hotsy Totsy Budapest</h3>
            <p className="font-lato text-sm text-gray-600 mb-2">21:45 • <a href="https://www.google.com/search?q=Hotsy+Totsy+Budapest" target="_blank" rel="noopener noreferrer">Nagymező utca 8</a></p>
            <p><strong>Why it fits you:</strong> Vinyl, low light, crafted classics with edge without attitude. Try a New York Sour.</p>
            <p><strong>Drinks:</strong> Cocktails 3,500-4,800 HUF (£8-£11).</p>
          </div>
        </VenueWithAlternative>
        
        <p className="text-sm font-lato text-gray-600 mt-4">Daily walking estimate: approximately 11 km</p>
      </div>
    );
  }
  
  if (day.dayNum === 3) {
    return (
      <div className="space-y-4">
        <img
          src={images.fisherman}
          alt="Fisherman's Bastion side streets and arches, quiet angles"
          className="w-full rounded-lg my-6"
          onError={(e) => {
            e.target.src = 'https://placehold.co/1080x607/8B7355/FFFFFF?text=Fishermans+Bastion';
          }}
        />
        
        <p><strong>11:00</strong> Metro to <strong>Batthyány tér</strong>, amble <strong>Fő utca</strong> lanes, climb quiet paths around <strong>Fisherman's Bastion</strong> for arches away from the terraces.</p>
        <p className="text-sm italic">Wet swap: Matthias Church cloisters or shift to House of Music.</p>
        
        <hr className="section-divider" />
        
        <VenueWithAlternative venueName="Pest-Buda Bistro" copyToClipboard={copyToClipboard} address="Fortuna utca 3, Budapest">
          <div className="suggestion-box">
            <h3>Lunch in the Castle District at Pest-Buda Bistro</h3>
            <p className="font-lato text-sm text-gray-600 mb-2">13:15 • <a href="https://www.google.com/search?q=Pest-Buda+Bistro+Budapest" target="_blank" rel="noopener noreferrer">Fortuna utca 3</a></p>
            <p><strong>Why it fits you:</strong> Intimate room, warm service. Goulash then chicken paprikash is the winning move.</p>
            <p><strong>Rating:</strong> Google 4.2</p>
            <p><strong>Prices:</strong> Mains 4,000-7,000 HUF (£9-£16).</p>
          </div>
        </VenueWithAlternative>
        
        <img
          src={images.buda}
          alt="Buda embankment long view to Parliament"
          className="w-full rounded-lg my-6"
          onError={(e) => {
            e.target.src = 'https://placehold.co/1080x607/8B7355/FFFFFF?text=Buda+Embankment';
          }}
        />
        
        <hr className="section-divider" />
        
        <p><strong>15:00-16:30 Golden hour</strong></p>
        <p><strong>Buda embankment</strong> for Parliament reflections, then towards <strong>Erzsébet Bridge</strong> lines.</p>
        <p className="text-sm italic">Wet swap: Zwack Unicum Museum and tasting in District IX.</p>
        
        <p><strong>17:30 Thermal soak</strong></p>
        <p><strong>Rudas Baths</strong> - Ottoman dome, rooftop hot pool, central location.</p>
        <p>or <strong>Veli Bej (Császár)</strong> - calmer 16th-century hammam feel with timed entries.</p>
        <p className="text-sm">Note: choose based on mood and energy.</p>
        
        <hr className="section-divider" />
        
        <VenueWithAlternative venueName="Két Szerecsen" copyToClipboard={copyToClipboard} address="Nagymező utca 14, Budapest">
          <div className="suggestion-box">
            <h3>Dinner at Két Szerecsen</h3>
            <p className="font-lato text-sm text-gray-600 mb-2">20:15 • <a href="https://www.google.com/search?q=K%C3%A9t+Szerecsen+Budapest" target="_blank" rel="noopener noreferrer">Nagymező utca 14</a></p>
            <p><strong>Why it fits you:</strong> Stylish yet relaxed. Duck breast or seafood risotto, both excellent.</p>
            <p><strong>Rating:</strong> Google 4.5</p>
            <p><strong>Prices:</strong> Mains 4,500-7,500 HUF (£10-£17).</p>
          </div>
        </VenueWithAlternative>
        
        <VenueWithAlternative venueName="Tuk Tuk Bar" copyToClipboard={copyToClipboard} address="Hold utca 5, Budapest">
          <div className="suggestion-box">
            <h3>Cocktails at Tuk Tuk Bar</h3>
            <p className="font-lato text-sm text-gray-600 mb-2">22:30 • <a href="https://www.google.com/search?q=Tuk+Tuk+Bar+Budapest" target="_blank" rel="noopener noreferrer">Hold utca 5</a></p>
            <p><strong>Why it fits you:</strong> Tight builds, proper seating. Try Bangkok Nights.</p>
            <p><strong>Drinks:</strong> Cocktails 3,500-4,500 HUF (£8-£10).</p>
          </div>
        </VenueWithAlternative>
        
        <p className="text-sm font-lato text-gray-600 mt-4">Daily walking estimate: approximately 10 km</p>
      </div>
    );
  }
  
  if (day.dayNum === 4) {
    return (
      <div className="space-y-4">
        <img
          src={images.szentendre}
          alt="Szentendre Fő tér cobbles and Danube promenade"
          className="w-full rounded-lg my-6"
          onError={(e) => {
            e.target.src = 'https://placehold.co/1080x607/8B7355/FFFFFF?text=Szentendre';
          }}
        />
        
        <div className="option-box">
          <h4 className="text-xl font-bold mb-2">Default: Szentendre (if weather fair)</h4>
          
          <p><strong>Getting there</strong></p>
          <p><strong>HÉV H5</strong> from <strong>Batthyány tér</strong> to <strong>Szentendre</strong>, every approximately 20 mins, approximately 39 mins. Use city ticket inside limits plus the <strong>H5 suburban add-on</strong> for Békásmegyer-Szentendre. Buy on BudapestGO or BKK machines.</p>
          
          <p><strong>Loop 11:00-16:00</strong></p>
          <p><strong>Fő tér</strong> cobbles → Serbian Orthodox Church yard textures → meander Ráby and Main Street lanes → <strong>Danube promenade</strong> for long frames → optional <strong>Retro Design Center</strong> for quirky interiors → back via shopfronts.</p>
          
          <p><strong>Lunch 13:00: Aranysárkány Vendéglő</strong> - venison or duck (warm dining room away from the day-trip clusters).</p>
          
          <p className="text-sm italic">Wet-weather tilt: Focus on galleries, Margit Kovács Ceramic Museum, arcades, and a shorter promenade window.</p>
        </div>
        
        <img
          src={images.liberty}
          alt="Liberty Bridge silhouettes at blue hour"
          className="w-full rounded-lg my-6"
          onError={(e) => {
            e.target.src = 'https://placehold.co/1080x607/8B7355/FFFFFF?text=Liberty+Bridge';
          }}
        />
        
        <hr className="section-divider" />
        
        <p><strong>Back in Pest by approximately 17:30</strong></p>
        <p><strong>Liberty Bridge</strong> silhouettes then <strong>blue hour on the Danube Promenade</strong>.</p>
        <p className="text-sm">Note: Chain Bridge pedestrian access worth a pass in blue hour.</p>
        
        <hr className="section-divider" />
        
        <div className="suggestion-box">
          <h3>Dinner 19:30</h3>
          <p className="font-lato text-sm text-gray-600 mb-2">Return to <strong>Fricska 2.0</strong> or <strong>Rosenstein</strong> as main choices.</p>
          <p>Back-ups: Dobrumba, Két Szerecsen.</p>
        </div>
        
        <div className="suggestion-box">
          <h3>Cocktail 22:00 at Boutiq'Bar</h3>
          <p className="font-lato text-sm text-gray-600 mb-2"><a href="https://www.google.com/search?q=Boutiq+Bar+Budapest" target="_blank" rel="noopener noreferrer">Paulay Ede utca 5</a></p>
          <p>Finish strong with a Smoked Old Fashioned.</p>
        </div>
        
        <hr className="section-divider" />
        
        <div className="option-box mt-6">
          <h4 className="text-xl font-bold mb-2">Bad-weather alternative: Vác</h4>
          
          <p><strong>Getting there</strong></p>
          <p><strong>MÁV</strong> suburban trains from <strong>Nyugati</strong> about every 20 mins, approximately 35-40 mins.</p>
          
          <p><strong>Compact loop</strong></p>
          <p><strong>Március 15. tér</strong> → Baroque main square and Cathedral facade → <strong>Danube promenade</strong> boardwalk → café stop and backstreets.</p>
          <p className="text-sm">Plenty of indoor pauses, fewer crowds, easy return for evening cocktails.</p>
        </div>
        
        <p className="text-sm font-lato text-gray-600 mt-4">Daily walking estimate: approximately 9 km</p>
      </div>
    );
  }
  
  if (day.dayNum === 5) {
    return (
      <div className="space-y-4">
        <p className="text-lg font-bold">Departure Morning - Friday 21 November</p>
        
        <p><strong>For 10:25 flight</strong></p>
        <p>Walk to <strong>Deák Ferenc tér</strong> and take <strong>100E</strong> to the airport, journey approximately 40 mins. Aim to be at BUD by <strong>08:35</strong> to keep a 90 min buffer. Safe latest leave from Klauzál tér <strong>approximately 07:50</strong>.</p>
        
        <p><strong>Contingency:</strong> leave approximately 07:30 for extra slack. If the 100E is disrupted, use <strong>200E</strong> via Kőbánya-Kispest, but only if needed.</p>
        
        <p className="text-sm italic">Much more civilised departure time. Proper breakfast possible.</p>
        
        <hr className="section-divider" />
        
        <div className="tip-box-sidebar">
          <h3 className="text-lg font-bold mb-2">Important reminders</h3>
          <p className="text-sm mb-2">✓ Check out by 10:00 (leave belongings in lockbox if needed)</p>
          <p className="text-sm mb-2">✓ 100E single ticket (2,200 HUF) from Deák Ferenc tér</p>
          <p className="text-sm mb-2">✓ Backpack only, no checked luggage</p>
          <p className="text-sm">✓ Terminal 2, easyJet U28732, 10:25 → 12:15</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 italic">Full itinerary details for {day.title}...</p>
    </div>
  );
}
