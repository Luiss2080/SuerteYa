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
  
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
    
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('ruleta:options', JSON.stringify(options));
      localStorage.setItem('ruleta:sound', soundEnabled.toString());
    }
  }, [options, soundEnabled, isLoaded]);

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
            onResult={setResult}
            soundEnabled={soundEnabled}
          />

          <div className="result-display fade-in" style={{ marginTop: '2rem' }}>
            {result ? `¡Ha ganado: ${result}! 🎉` : (isSpinning ? '...' : '')}
          </div>
        </div>
      </main>
      
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
