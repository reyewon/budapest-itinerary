import React from 'react';
import VenueCard from './VenueCard';

function renderMarkdown(text) {
  if (!text) return null;
  // Split on newlines to create paragraphs
  return text.split('\n').map((line, i) => {
    // Bold: **text**
    let processed = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Italic: _text_
    processed = processed.replace(/(?<!\w)_(.+?)_(?!\w)/g, '<em>$1</em>');

    if (!processed.trim()) return <br key={i} />;
    return <p key={i} dangerouslySetInnerHTML={{ __html: processed }} />;
  });
}

function DayImage({ imageData, images }) {
  if (!imageData) return null;

  // imageData can be a single image object or an array entry
  let img;
  if (typeof imageData === 'string') {
    // simple key reference
    img = images.dayImages[imageData];
  } else {
    img = imageData;
  }

  if (!img) return null;

  return (
    <img
      src={img.src}
      alt={img.alt}
      className="w-full rounded-lg my-6"
      onError={(e) => {
        e.target.src = `https://placehold.co/1080x607/8B7355/FFFFFF?text=${img.fallback || 'Image'}`;
      }}
    />
  );
}

function resolveImage(section, images) {
  const key = section.imageKey;
  if (!key || !images.dayImages[key]) return null;

  const dayImg = images.dayImages[key];

  // Array of images (e.g. day3 has 2 images)
  if (Array.isArray(dayImg)) {
    const idx = section.imageIndex ?? 0;
    return dayImg[idx] || null;
  }

  // Single image object
  return dayImg;
}

export default function DayContent({ day, tripConfig, copyToClipboard }) {
  const { alternatives, city, theme, images } = tripConfig;

  if (!day.sections || day.sections.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600 italic">Full itinerary details for {day.title}...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {day.sections.map((section, idx) => {
        switch (section.type) {
          case 'image': {
            const imgData = resolveImage(section, images);
            return <DayImage key={idx} imageData={imgData} images={images} />;
          }

          case 'divider':
            return <hr key={idx} className="section-divider" />;

          case 'text':
            return (
              <div key={idx}>
                {section.title && (
                  section.titleSize === 'lg'
                    ? <p className="text-lg font-bold">{section.title}</p>
                    : <p><strong>{section.title}</strong></p>
                )}
                {section.content && renderMarkdown(section.content)}
                {section.wet && (
                  <p className="text-sm italic">Wet-weather swap: {section.wet}</p>
                )}
                {section.note && (
                  <p className="text-sm">Note: {section.note}</p>
                )}
              </div>
            );

          case 'venue':
            return (
              <VenueCard
                key={idx}
                venue={section}
                alternatives={alternatives}
                city={city}
                copyToClipboard={copyToClipboard}
                theme={theme}
              />
            );

          case 'simpleVenue':
            return (
              <div key={idx} className="suggestion-box">
                <h3>{section.heading}</h3>
                {section.address && (
                  <p className="font-lato text-sm text-gray-600 mb-2">
                    <a
                      href={section.searchQuery ? `https://www.google.com/search?q=${section.searchQuery}` : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {section.address}
                    </a>
                  </p>
                )}
                {section.content && renderMarkdown(section.content)}
              </div>
            );

          case 'optionBox':
            return (
              <div key={idx} className="option-box">
                <h4 className="text-xl font-bold mb-2">{section.title}</h4>
                {section.blocks.map((block, bIdx) => (
                  <div key={bIdx}>
                    {block.title && <p><strong>{block.title}</strong></p>}
                    {block.content && renderMarkdown(block.content)}
                  </div>
                ))}
              </div>
            );

          case 'infoBox':
            return (
              <div key={idx} className="tip-box-sidebar">
                <h3 className="text-lg font-bold mb-2">{section.title}</h3>
                {section.items.map((item, iIdx) => (
                  <p key={iIdx} className="text-sm mb-2">✓ {item}</p>
                ))}
              </div>
            );

          default:
            return null;
        }
      })}
      {day.walkingEstimate && (
        <p className="text-sm font-lato text-gray-600 mt-4">Daily walking estimate: {day.walkingEstimate}</p>
      )}
    </div>
  );
}
