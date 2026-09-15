import { useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

const playTickSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
    
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) { console.error('Audio play failed', e) }
};

const playWinSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Play a major chord
    const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.value = freq;
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + 2);
    });
  } catch (e) { console.error('Audio play failed', e) }
};

const RouletteWheel = ({ options, isSpinning, setIsSpinning, onResult, soundEnabled = true }) => {
  const canvasRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const lastTickAngleRef = useRef(0);

  const colors = [
    '#ff007f', '#00f2fe', '#f9d423', '#b224ef', 
    '#ff4e50', '#fc913a', '#4a4e4d', '#0e9aa7'
  ];

  useEffect(() => {
    drawWheel();
  }, [options, rotation]);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (options.length === 0) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.stroke();
      
      ctx.fillStyle = '#a0a0b0';
      ctx.font = '20px Outfit';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Añade opciones', centerX, centerY);
      return;
    }

    const arcSize = (2 * Math.PI) / options.length;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);
    ctx.translate(-centerX, -centerY);

    for (let i = 0; i < options.length; i++) {
      const angle = i * arcSize;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, angle + arcSize);
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#0f0c29';
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle + arcSize / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 18px Outfit';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 4;
      // Truncate long text
      let text = options[i];
      if(text.length > 15) text = text.substring(0, 15) + '...';
      ctx.fillText(text, radius - 20, 5);
      ctx.restore();
    }
    
    ctx.restore();

    // Draw center indicator/pointer
    ctx.beginPath();
    ctx.moveTo(canvas.width - 20, centerY);
    ctx.lineTo(canvas.width, centerY - 15);
    ctx.lineTo(canvas.width, centerY + 15);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  const spin = () => {
    if (isSpinning || options.length < 2) return;
    setIsSpinning(true);
    onResult(null);

    const spinDuration = 4000;
    const spins = 5 + Math.random() * 5; 
    const targetAngle = rotation + (spins * 2 * Math.PI);
    const arcSize = (2 * Math.PI) / options.length;
    
    const startTime = performance.now();
    lastTickAngleRef.current = rotation;

    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      
      // easeOutQuart
      const ease = 1 - Math.pow(1 - progress, 4);
      const currentRotation = rotation + (targetAngle - rotation) * ease;
      
      setRotation(currentRotation);

      // Check if we passed a segment boundary to play tick
      if (currentRotation - lastTickAngleRef.current >= arcSize) {
        if (soundEnabled) playTickSound();
        lastTickAngleRef.current = currentRotation - ((currentRotation - lastTickAngleRef.current) % arcSize);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        const normalizedRotation = currentRotation % (2 * Math.PI);
        const index = Math.floor(((2 * Math.PI) - normalizedRotation) / arcSize) % options.length;
        
        const winner = options[index];
        onResult(winner);
        if (soundEnabled) playWinSound();
        
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ff007f', '#00f2fe', '#f9d423']
        });
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="wheel-container glass-panel" style={{ padding: '2rem', position: 'relative' }}>
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={400}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      
      <button 
        className="btn btn-primary" 
        onClick={spin}
        disabled={isSpinning || options.length < 2}
        style={{ marginTop: '1.5rem', width: '200px', height: '50px' }}
      >
        {isSpinning ? 'Girando...' : '🎲 Girar Ruleta'}
      </button>
    </div>
  );
};

export default RouletteWheel;
