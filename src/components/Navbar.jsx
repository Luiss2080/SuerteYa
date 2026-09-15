import { HelpCircle, Settings } from 'lucide-react';
import ShareButton from './ShareButton';

const Navbar = ({ onOpenHelp, onOpenSettings, options }) => {
  return (
    <nav className="navbar glass-panel">
      <div className="navbar-brand">
        <h1>🎡 Ruleta Pro</h1>
      </div>
      <div className="navbar-actions">
        <ShareButton options={options} />
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
