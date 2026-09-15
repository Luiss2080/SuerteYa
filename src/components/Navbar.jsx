import { HelpCircle, Settings, History, Maximize, Minimize } from 'lucide-react';
import ShareButton from './ShareButton';
import { useState, useEffect } from 'react';

const Navbar = ({ onOpenHelp, onOpenSettings, onOpenHistory, options }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-brand">
        <h1>🎡 Ruleta Pro</h1>
      </div>
      <div className="navbar-actions">
        <ShareButton options={options} />
        <button className="btn-icon" onClick={onOpenHistory} aria-label="Historial">
          <History size={24} />
        </button>
        <button className="btn-icon" onClick={toggleFullscreen} aria-label="Pantalla Completa">
          {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
        </button>
        <button className="btn-icon" onClick={onOpenHelp} aria-label="Ayuda">
          <HelpCircle size={24} />
        </button>
        <button className="btn-icon" onClick={onOpenSettings} aria-label="Configuración">
          <Settings size={24} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
