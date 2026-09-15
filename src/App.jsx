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
  const [drawMode, setDrawMode] = useState(false); // Sorteo mode
  const [spinSpeed, setSpinSpeed] = useState('4000'); // Velocidad de giro
  const [history, setHistory] = useState([]);
  
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

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

    const savedDrawMode = localStorage.getItem('ruleta:drawMode');
    if (savedDrawMode !== null) setDrawMode(savedDrawMode === 'true');
    
    const savedSpinSpeed = localStorage.getItem('ruleta:spinSpeed');
    if (savedSpinSpeed !== null) setSpinSpeed(savedSpinSpeed);

    const savedHistory = localStorage.getItem('ruleta:history');
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch (e) {}
    }

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
      localStorage.setItem('ruleta:drawMode', drawMode.toString());
      localStorage.setItem('ruleta:spinSpeed', spinSpeed.toString());
      localStorage.setItem('ruleta:theme', theme);
      localStorage.setItem('ruleta:history', JSON.stringify(history));
      document.body.setAttribute('data-theme', theme);
    }
  }, [options, soundEnabled, theme, drawMode, spinSpeed, history, isLoaded]);

  const handleResult = (winner) => {
    if (winner) {
      setResult(winner);
      setIsVictoryOpen(true);
      setHistory(prev => {
        const newHistory = [winner, ...prev].slice(0, 10);
        return newHistory;
      });
    } else {
      setResult(null);
    }
  };

  const handleVictoryClose = () => {
    setIsVictoryOpen(false);
    if (drawMode && result) {
      // Eliminate the winner from options
      setOptions(prev => prev.filter(opt => opt !== result));
    }
  };

  const clearHistory = () => {
    if (confirm('¿Seguro que quieres borrar el historial?')) {
      setHistory([]);
    }
  };

  return (
    <>
      <Navbar 
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
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
            spinSpeed={parseInt(spinSpeed, 10)}
          />
        </div>
      </main>
      
      {/* Modals */}
      <Modal isOpen={isVictoryOpen} onClose={handleVictoryClose} title="¡Tenemos un Ganador!">
        <div style={{ textAlign: 'center' }}>
          <div className="victory-text fade-in">{result}</div>
          <button className="btn btn-primary" onClick={handleVictoryClose}>
            {drawMode ? '¡Genial! (Eliminar opción)' : '¡Genial!'}
          </button>
        </div>
      </Modal>

      <Modal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} title="Historial de Resultados">
        {history.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No hay resultados aún.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {history.map((item, idx) => (
              <div key={idx} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)', marginRight: '1rem' }}>#{history.length - idx}</span>
                <strong>{item}</strong>
              </div>
            ))}
            <button className="btn btn-secondary" onClick={clearHistory} style={{ marginTop: '1rem' }}>Borrar Historial</button>
          </div>
        )}
      </Modal>

      <Modal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} title="Manual de Uso">
        <h3>¿Cómo usar la Ruleta?</h3>
        <p>Añade opciones en el panel lateral o elige una de las <strong>plantillas predefinidas</strong>. Cuando estés listo, pulsa "Girar Ruleta".</p>
        
        <h3>Modo Sorteo</h3>
        <p>Actívalo en Configuración. Cuando esté activo, la opción ganadora desaparecerá de la lista automáticamente para no volver a salir.</p>

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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <span>Duración de Giro</span>
          <select 
            className="input-field" 
            style={{ width: 'auto' }}
            value={spinSpeed}
            onChange={(e) => setSpinSpeed(e.target.value)}
          >
            <option value="2000">Rápido (2s)</option>
            <option value="4000">Normal (4s)</option>
            <option value="8000">Lento (8s)</option>
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ display: 'block' }}>Modo Sorteo</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Elimina al ganador automáticamente</span>
          </div>
          <button 
            className="btn btn-secondary" 
            onClick={() => setDrawMode(!drawMode)}
          >
            {drawMode ? '✅ Activado' : '❌ Desactivado'}
          </button>
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
      </Modal>
    </>
  )
}

export default App
