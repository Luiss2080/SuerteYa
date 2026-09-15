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
      gainNode.connect(audioCtxRef.current.destination);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = audioCtxRef.current.currentTime;
    // C Major Chord Arpeggio
    playNote(523.25, now, 1);       // C5
    playNote(659.25, now + 0.1, 1); // E5
    playNote(783.99, now + 0.2, 1); // G5
    playNote(1046.50, now + 0.3, 1.5); // C6
  };

  useEffect(() => {
    drawWheel();
  }, [options, rotation]);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (options.length === 0) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.fill();
      return;
    }

    const arcSize = (2 * Math.PI) / options.length;
    const computedStyle = getComputedStyle(document.body);
    const colorPops = [
      computedStyle.getPropertyValue('--accent-1').trim(),
      computedStyle.getPropertyValue('--accent-2').trim(),
      computedStyle.getPropertyValue('--accent-3').trim(),
      computedStyle.getPropertyValue('--accent-4').trim()
    ];

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);

    for (let i = 0; i < options.length; i++) {
      const angle = i * arcSize;
      ctx.beginPath();
      ctx.arc(0, 0, radius, angle, angle + arcSize);
      ctx.lineTo(0, 0);
      ctx.fillStyle = colorPops[i % colorPops.length] || '#ff007f';
      ctx.fill();
      
      // Separators
      ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.rotate(angle + arcSize / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.max(10, 24 - options.length)}px 'Outfit', sans-serif`;
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 4;
      
      const text = options[i].length > 15 ? options[i].substring(0, 15) + '...' : options[i];
      ctx.fillText(text, radius - 20, 5);
      ctx.restore();
    }
    
    // Center dot
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, 2 * Math.PI);
    ctx.fillStyle = '#1e1b4b';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.restore();

    // Pointer is now drawn with HTML/CSS instead of Canvas to allow animation
  };

  const spin = () => {
    if (isSpinning || options.length < 2) return;
    setIsSpinning(true);
    onResult(null);

    const spins = 5 + Math.random() * 5; 
    const targetAngle = rotation + (spins * 2 * Math.PI);
    const arcSize = (2 * Math.PI) / options.length;
    
    const startTime = performance.now();
    lastTickAngleRef.current = rotation;

    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / spinSpeed, 1);
      
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
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#ff007f', '#00f2fe', '#f9d423'],
          zIndex: 2000
        });
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="wheel-container glass-panel" style={{ padding: '2rem', position: 'relative' }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={400}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
        <div className={`wheel-pointer ${isSpinning ? 'is-spinning' : ''}`}></div>
      </div>
      
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
