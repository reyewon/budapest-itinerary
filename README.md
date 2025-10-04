
# 🏛️ Budapest Travel Itinerary

An interactive, feature-rich travel itinerary app for a 5-day trip to Budapest (17-21 November 2025). Built with React, this app includes real-time weather forecasts, currency conversion, translation tools, interactive maps, and a detailed day-by-day guide.

## ✨ Features

### 📅 Day-by-Day Itinerary
- Complete 5-day schedule with activities, dining, and entertainment
- Activity checklist to track what you've completed
- Automatic "past day" detection to focus on current/upcoming days
- Beautiful typography and elegant design inspired by travel magazines

### 🛠️ Built-in Travel Tools
- **Live Translation**: English ↔ Hungarian with text-to-speech
- **Currency Converter**: Real-time GBP to HUF exchange rates
- **Weather Forecasts**: Hourly weather for each day of your trip
- **Interactive Maps**: Google Maps integration for all locations
- **PDF Export**: Print your entire itinerary for offline access

### 🗺️ Local Recommendations
- Curated restaurant and bar selections
- Alternative venue options for every recommendation
- Address copying for easy navigation
- Price estimates in both HUF and GBP

### 📱 Responsive Design
- Works perfectly on desktop, tablet, and mobile
- Sticky navigation for easy day switching
- Mobile-optimized sidebar with travel tools
- Print-friendly layout for physical copies

## 🎨 Design Philosophy

The design channels the aesthetic of high-end travel magazines:
- Elegant serif typography (Playfair Display, Merriweather)
- Warm terracotta and sienna color palette
- Clean, spacious layouts with generous whitespace
- Magazine-style dividers and section breaks
- Professional food and architecture photography

## 🚀 Technologies Used

- **React** - Component-based UI
- **Google Maps API** - Interactive location maps
- **Google Translate API** - Real-time translation
- **OpenWeather API** - Weather forecasts
- **Exchange Rate API** - Live currency conversion
- **Tailwind CSS** - Utility-first styling
- **LocalStorage** - Activity progress tracking

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/reyewon/budapest-itinerary.git

# Navigate to the project directory
cd budapest-itinerary

# Install dependencies
npm install

# Start the development server
npm start
```

## 🔑 API Keys

This project uses several APIs that require keys. The keys are included in the code for demo purposes, but for production use, you should:

1. Get your own API keys:
   - [Google Maps API](https://developers.google.com/maps)
   - [Google Translate API](https://cloud.google.com/translate)
   - [OpenWeather API](https://openweathermap.org/api)

2. Replace the API keys in `App.jsx`:
```javascript
const GOOGLE_TRANSLATE_API_KEY = 'your-key-here';
const GOOGLE_MAPS_API_KEY = 'your-key-here';
const OPENWEATHER_API_KEY = 'your-key-here';
```

## 📖 Usage

### Navigation
- Use the top navigation bar to jump to any day
- Click "Show All Days" to see past days after your trip starts
- Use "Export PDF" to save a printable version

### Tools Sidebar
- **Translator**: Type in English or Hungarian for instant translation
- **Currency Converter**: Enter amounts to convert between GBP and HUF
- **Essentials**: Quick reference for weather, packing, and accommodation
- **Travel**: Flight and transport information

### Activity Tracking
- Check off activities as you complete them
- Progress is saved locally and persists across sessions
- View completion status in the header

### Alternative Options
- Click "+ Show Alternative Option" on any venue
- See backup restaurant/bar recommendations
- Copy addresses directly to clipboard

## 🗺️ Itinerary Highlights

### Day 1: Arrival & Jewish Quarter
Evening photowalk through Gozsdu Passage with dinner at Fricska 2.0

### Day 2: Parliament & Lipótváros
Explore the neoclassical grid, golden hour at the Danube, dinner at Rosenstein

### Day 3: Buda Castle & Thermal Baths
Fisherman's Bastion views, thermal soak at Rudas, Castle District dining

### Day 4: Day Trip to Szentendre
Baroque river town exploration with Danube-side photography

### Day 5: Departure
Organized morning departure with airport transfer details

## 🎯 Target Audience

This itinerary is designed for:
- Solo travelers or couples
- Photography enthusiasts
- Food and cocktail lovers
- Those who appreciate architecture and history
- Travelers who want structure but also flexibility

## 📝 Customization

Want to adapt this for your own trip? Key areas to customize:

1. **Dates**: Update the `date` field in `itineraryDays` array
2. **Locations**: Modify the `locations` array for each day
3. **Activities**: Edit the `activities` array with your plans
4. **Venues**: Change restaurant/bar recommendations in the `DayContent` component
5. **Images**: Replace image URLs in the `IMAGES` object

## 🤝 Contributing

This is a personal travel itinerary, but feel free to:
- Fork it for your own trips
- Submit issues if you find bugs
- Suggest improvements via pull requests

## 📄 License

MIT License - feel free to use this as a template for your own travel apps!

## 🙏 Acknowledgments

- Venue recommendations curated from local Budapest guides
- Photography from various travel sources
- Inspired by elegant travel magazine layouts
- Built with assistance from Claude (Anthropic)

## 📧 Contact

Created by [@reyewon](https://github.com/reyewon)

---

**Have a wonderful trip to Budapest! 🇭🇺✨**
