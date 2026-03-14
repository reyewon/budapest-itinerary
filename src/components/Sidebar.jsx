import React from 'react';

export default function Sidebar({
  tripConfig,
  sidebarTab, setSidebarTab,
  translateFrom, setTranslateFrom,
  translateTo, translateDirection, translating,
  swapLanguages, speakText, copyToClipboard,
  homeAmount, localAmount,
  handleHomeChange, handleLocalChange,
  exchangeRate, rateLoading,
  openGoogleLens, handlePrint
}) {
  const { translation, currency, weather, packing, accommodation, flights, transport, theme } = tripConfig;

  const tabStyle = (tab) => ({
    borderBottomColor: sidebarTab === tab ? theme.primaryColor : 'transparent',
    backgroundColor: sidebarTab === tab ? theme.primaryColor : 'transparent'
  });

  const btnStyle = {
    backgroundColor: theme.primaryColor,
    borderRadius: '0px'
  };

  return (
    <>
      <div className="flex border-b border-gray-200 mb-4">
        {['tools', 'essentials', 'travel'].map(tab => (
          <button
            key={tab}
            className={`px-4 py-2 font-lato text-sm ${sidebarTab === tab ? 'border-b-2 text-white' : 'text-gray-600'}`}
            style={tabStyle(tab)}
            onClick={() => setSidebarTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {sidebarTab === 'tools' && (
        <>
          <div className="tip-box-sidebar">
            <h3 className="text-lg font-bold mb-3">Translator</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-lato">
                  {translateDirection === `${translation.sourceLang}-${translation.targetLang}`
                    ? `${translation.sourceLabel} → ${translation.targetLabel}`
                    : `${translation.targetLabel} → ${translation.sourceLabel}`
                  }
                </span>
                <button onClick={swapLanguages} className="text-amber-700 hover:text-amber-800">⇄</button>
              </div>
              <textarea
                value={translateFrom}
                onChange={(e) => setTranslateFrom(e.target.value)}
                placeholder={
                  translateDirection === `${translation.sourceLang}-${translation.targetLang}`
                    ? translation.sourcePlaceholder
                    : translation.targetPlaceholder
                }
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
                      onClick={() => speakText(translateTo, translateDirection === `${translation.sourceLang}-${translation.targetLang}` ? translation.targetLang : translation.sourceLang)}
                      className="text-xs text-white px-3 py-1"
                      style={btnStyle}
                      onMouseEnter={(e) => e.target.style.backgroundColor = theme.primaryHover}
                      onMouseLeave={(e) => e.target.style.backgroundColor = theme.primaryColor}
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
              {translation.commonPhrases && (
                <div className="mt-3 text-xs text-gray-600">
                  <p className="font-bold mb-1">Common phrases:</p>
                  <p>{translation.commonPhrases}</p>
                </div>
              )}
            </div>
          </div>

          <div className="tip-box-sidebar">
            <h3 className="text-lg font-bold mb-3">Currency Converter</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-lato text-gray-700">{currency.home.label}</label>
                <input
                  type="number"
                  value={homeAmount}
                  onChange={(e) => handleHomeChange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="text-center text-gray-500">
                <span className="text-xs">
                  {rateLoading ? 'Loading rate...' : `1 ${currency.home.code} = ${exchangeRate.toFixed(2)} ${currency.local.code}`}
                </span>
              </div>
              <div>
                <label className="text-sm font-lato text-gray-700">{currency.local.label}</label>
                <input
                  type="number"
                  value={localAmount}
                  onChange={(e) => handleLocalChange(e.target.value)}
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
              style={btnStyle}
              onMouseEnter={(e) => e.target.style.backgroundColor = theme.primaryHover}
              onMouseLeave={(e) => e.target.style.backgroundColor = theme.primaryColor}
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
              style={btnStyle}
              onMouseEnter={(e) => e.target.style.backgroundColor = theme.primaryHover}
              onMouseLeave={(e) => e.target.style.backgroundColor = theme.primaryColor}
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
            <h3 className="text-lg font-bold mb-2">Weather in {weather.monthLabel}</h3>
            <p className="text-sm">{tripConfig.city}: {weather.summary}</p>
          </div>
          <div className="tip-box-sidebar">
            <h3 className="text-lg font-bold mb-2">Packing Essentials</h3>
            <p className="text-sm">{packing}</p>
          </div>
          <div className="tip-box-sidebar">
            <h3 className="text-lg font-bold mb-2">Accommodation</h3>
            <p className="text-sm mb-2">
              <strong>{tripConfig.city}:</strong>{' '}
              <a href={`https://www.google.com/search?q=${accommodation.searchQuery}`} target="_blank" rel="noopener noreferrer">
                {accommodation.name}, {accommodation.address}
              </a>
            </p>
            <p className="text-sm">
              Check-in from {accommodation.checkIn}; check-out by {accommodation.checkOut}. {accommodation.instructions}
            </p>
          </div>
        </>
      )}

      {sidebarTab === 'travel' && (
        <>
          <div className="tip-box-sidebar">
            <h3 className="text-lg font-bold mb-2">Flights</h3>
            <p className="text-sm mb-2">
              <strong>Outbound:</strong> {flights.outbound.airline} {flights.outbound.flightNumber}, {flights.outbound.route}, {flights.outbound.date}, {flights.outbound.times}
            </p>
            <p className="text-sm">
              <strong>Return:</strong> {flights.return.airline} {flights.return.flightNumber}, {flights.return.route}, {flights.return.date}, {flights.return.times}
            </p>
          </div>
          <div className="tip-box-sidebar">
            <h3 className="text-lg font-bold mb-2">Airport Transfer</h3>
            <p className="text-sm mb-2"><strong>{transport.airportTransfer.name}:</strong> {transport.airportTransfer.details}</p>
            <p className="text-sm">{transport.airportTransfer.note}</p>
          </div>
          <div className="tip-box-sidebar">
            <h3 className="text-lg font-bold mb-2">Getting Around</h3>
            <p className="text-sm mb-2">{transport.gettingAround.modes}</p>
            <p className="text-sm">{transport.gettingAround.appNote}</p>
          </div>
        </>
      )}
    </>
  );
}
