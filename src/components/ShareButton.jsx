import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

const ShareButton = ({ options }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (options.length === 0) return;
    
    // Create sharing URL
    const baseUrl = window.location.origin + window.location.pathname;
    const encodedOpts = encodeURIComponent(JSON.stringify(options));
    const shareUrl = `${baseUrl}?opts=${encodedOpts}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button 
      className="btn btn-secondary" 
      onClick={handleShare}
      disabled={options.length === 0}
      style={{ alignSelf: 'flex-end', marginTop: '1rem' }}
    >
      {copied ? <Check size={18} /> : <Share2 size={18} />}
      {copied ? '¡Enlace copiado!' : 'Compartir Ruleta'}
    </button>
  );
};

export default ShareButton;
