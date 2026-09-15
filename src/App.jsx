import { useState, useEffect } from 'react'
import RouletteWheel from './components/RouletteWheel'
import OptionsManager from './components/OptionsManager'
import Navbar from './components/Navbar'
import Modal from './components/Modal'
import './index.css'

function App() {
  const [options, setOptions] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState('neon');
  
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState(false);

  // Initialize from URL or localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const optsParam = params.get('opts');
    
    if (optsParam) {
      try {
        const decodedOpts = JSON.parse(decodeURIComponent(optsParam));
        if (Array.isArray(decodedOpts)) {
          setOptions(decodedOpts);
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (e) {
        console.error('Error parsing URL options', e);
      }
    } else {
      const savedOpts = localStorage.getItem('ruleta:options');
      if (savedOpts) {
        try { setOptions(JSON.parse(savedOpts)); } catch (e) {}
      } else {
        setOptions(['Pizza', 'Sushi', 'Hamburguesa', 'Ensalada']);
      }
    }
    
    const savedSound = localStorage.getItem('ruleta:sound');
    if (savedSound !== null) setSoundEnabled(savedSound === 'true');

    const savedTheme = localStorage.getItem('ruleta:theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.setAttribute('data-theme', savedTheme);
    } else {
      document.body.setAttribute('data-theme', 'neon');
    }
    
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('ruleta:options', JSON.stringify(options));
      localStorage.setItem('ruleta:sound', soundEnabled.toString());
      localStorage.setItem('ruleta:theme', theme);
      document.body.setAttribute('data-theme', theme);
    }
  }, [options, soundEnabled, theme, isLoaded]);

  const handleResult = (winner) => {
    if (winner) {
      setResult(winner);
      setIsVictoryOpen(true);
    } else {
      setResult(null);
    }
  };

  return (
    <>
      <Navbar 
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        options={options}
      />

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
            soundEnabled={soundEnabled}
          />
        </div>
      </main>
      
      {/* Modals */}
      <Modal isOpen={isVictoryOpen} onClose={() => setIsVictoryOpen(false)} title="¡Tenemos un Ganador!">
        <div style={{ textAlign: 'center' }}>
          <div className="victory-text fade-in">{result}</div>
          <button className="btn btn-primary" onClick={() => setIsVictoryOpen(false)}>¡Genial!</button>
        </div>
      </Modal>

      <Modal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} title="Manual de Uso">
        <h3>¿Cómo usar la Ruleta?</h3>
        <p>Añade opciones en el panel lateral o elige una de las <strong>plantillas predefinidas</strong>. Cuando estés listo, pulsa "Girar Ruleta".</p>
        
        <h3>Compartir y Guardar</h3>
        <ul>
          <li><strong>Compartir:</strong> Usa el icono de compartir en la barra superior. Se generará un enlace único con tus opciones exactas para enviar a amigos.</li>
          <li><strong>Guardado Automático:</strong> Tus opciones se guardan automáticamente en tu navegador. Puedes cerrar la pestaña y volver, y seguirán ahí.</li>
        </ul>
      </Modal>

      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Configuración">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <span>Tema Visual</span>
          <select 
            className="input-field" 
            style={{ width: 'auto' }}
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="neon">Neon Cyberpunk</option>
            <option value="candy">Sunset Candy</option>
            <option value="minimalist">Dark Minimalist</option>
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Sonidos y Efectos WebAudio</span>
          <button 
            className="btn btn-secondary" 
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? '🔊 Activado' : '🔇 Silenciado'}
          </button>
        </div>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          El sonido funciona nativamente mediante la API Web Audio de tu navegador.
        </p>
      </Modal>
    </>
  )
}

export default App
