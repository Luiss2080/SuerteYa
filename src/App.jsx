import { useState, useEffect } from 'react'
import RouletteWheel from './components/RouletteWheel'
import OptionsManager from './components/OptionsManager'
import ShareButton from './components/ShareButton'
import './index.css'

function App() {
  const [options, setOptions] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from URL or localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const optsParam = params.get('opts');
    
    if (optsParam) {
      try {
        const decodedOpts = JSON.parse(decodeURIComponent(optsParam));
        if (Array.isArray(decodedOpts)) {
          setOptions(decodedOpts);
          // Clean URL without reloading
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (e) {
        console.error('Error parsing URL options', e);
      }
    } else {
      const savedOpts = localStorage.getItem('ruleta:options');
      if (savedOpts) {
        try {
          setOptions(JSON.parse(savedOpts));
        } catch (e) {
          console.error('Error parsing localStorage options', e);
        }
      } else {
        // Default options
        setOptions(['Pizza', 'Sushi', 'Hamburguesa', 'Ensalada']);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('ruleta:options', JSON.stringify(options));
    }
  }, [options, isLoaded]);

  const handleResult = (winner) => {
    setResult(winner);
  };

  return (
    <>
      <header className="header">
        <h1>🎡 Ruleta Pro</h1>
        <p style={{ color: 'var(--text-muted)' }}>Deja que la suerte decida por ti</p>
      </header>

      <main className="app-container">
        <OptionsManager 
          options={options} 
          setOptions={setOptions} 
          isSpinning={isSpinning} 
        />
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <RouletteWheel 
            options={options} 
            isSpinning={isSpinning}
            setIsSpinning={setIsSpinning}
            onResult={handleResult}
          />

          <div className="result-display fade-in" style={{ marginTop: '2rem' }}>
            {result ? `¡Ha ganado: ${result}! 🎉` : (isSpinning ? '...' : '')}
          </div>

          <ShareButton options={options} />
        </div>
      </main>
    </>
  )
}

export default App
