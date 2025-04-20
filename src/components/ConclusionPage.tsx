import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ConclusionPage.css';
import { personas } from '../data/personaData';

// Helper function to get image path
const getPersonaImagePath = (personaName: string) => {
  // Convert persona name to the correct filename format
  const fileName = personaName.replace(/\s+/g, '-').toLowerCase();
  return `/assets/Personas/${fileName}.png`;
};

interface LocationState {
  personaScores: {
    [key: string]: number;
  };
}

const ConclusionPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const personaScores = state?.personaScores || {};

  // Find the highest scoring persona
  const getHighestScoringPersona = () => {
    let highestScore = -1;
    let highestPersonas: string[] = [];

    Object.entries(personaScores).forEach(([persona, score]) => {
      if (score > highestScore) {
        highestScore = score;
        highestPersonas = [persona];
      } else if (score === highestScore) {
        highestPersonas.push(persona);
      }
    });

    // Randomly select one persona from those with the highest score
    const randomIndex = Math.floor(Math.random() * highestPersonas.length);
    return highestPersonas[randomIndex];
  };

  const [currentPersonaIndex, setCurrentPersonaIndex] = useState(() => {
    const highestPersona = getHighestScoringPersona();
    return personas.findIndex(p => p.name !== highestPersona);
  });
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageLoad = (personaName: string) => {
    setLoadedImages(prev => new Set(prev).add(personaName));
    setImageErrors(prev => {
      const newSet = new Set(prev);
      newSet.delete(personaName);
      return newSet;
    });
  };

  const handleImageError = (personaName: string) => {
    setImageErrors(prev => new Set(prev).add(personaName));
    console.error(`Failed to load image for ${personaName}`);
  };

  const handleRetakeQuiz = () => {
    navigate('/quiz');
  };

  const navigatePersona = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setCurrentPersonaIndex(prev => 
        prev === 0 ? personas.length - 1 : prev - 1
      );
    } else {
      setCurrentPersonaIndex(prev => 
        prev === personas.length - 1 ? 0 : prev + 1
      );
    }
  };

  const highestPersona = getHighestScoringPersona();
  const primaryPersona = personas.find(p => p.name === highestPersona);

  return (
    <div className="conclusion-page">
      <div className="floating-element" />
      <div className="floating-element" />
      <div className="floating-element" />
      
      <div className="conclusion-container">
        {primaryPersona && (
          <>
            <h1>
              <span className="emoji-left">🎉</span>
              <span className="congratulations-text">
                Congratulations!
              </span>
              <span className="persona-name-text">
                You're a {primaryPersona.name}
              </span>
              <span className="emoji-right">🎉</span>
            </h1>
            <div className="primary-persona">
              <div className="persona-card">
                <img 
                  src={getPersonaImagePath(primaryPersona.name)} 
                  alt={primaryPersona.name}
                  className="persona-image"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    console.error(`Failed to load image for ${primaryPersona.name}`);
                  }}
                />
                <p>{primaryPersona.description}</p>
              </div>
            </div>
          </>
        )}

        <div className="other-personas-container">
          <h2>Explore Other Personas:</h2>
          <div className="personas-scroll-container">
            <button 
              className="scroll-button scroll-left" 
              onClick={() => navigatePersona('left')}
              aria-label="Previous persona"
            >
              ◄
            </button>
            <div className="personas-display">
              <div className="persona-slide">
                <div className="persona-scroll-item">
                  {!imageErrors.has(personas[currentPersonaIndex].name) && (
                    <img 
                      src={getPersonaImagePath(personas[currentPersonaIndex].name)} 
                      alt={personas[currentPersonaIndex].name}
                      className="persona-image"
                      onLoad={() => handleImageLoad(personas[currentPersonaIndex].name)}
                      onError={() => handleImageError(personas[currentPersonaIndex].name)}
                    />
                  )}
                  <h3>{personas[currentPersonaIndex].name}</h3>
                  <p>{personas[currentPersonaIndex].description}</p>
                </div>
              </div>
            </div>
            <button 
              className="scroll-button scroll-right"
              onClick={() => navigatePersona('right')}
              aria-label="Next persona"
            >
              ►
            </button>
          </div>
        </div>

        <div className="scores-container">
          <h2>All Persona Scores:</h2>
          <div className="scores-grid">
            {personas.map(persona => (
              <div 
                key={persona.name} 
                className={`score-item ${persona.name === highestPersona ? 'highest' : ''}`}
              >
                <span className="persona-name">{persona.name}</span>
                <span className="persona-score">{personaScores[persona.name] || 0} points</span>
              </div>
            ))}
          </div>
        </div>

        <button 
          className="retake-button"
          onClick={handleRetakeQuiz}
        >
          Take Again
        </button>
      </div>
    </div>
  );
};

export default ConclusionPage; 