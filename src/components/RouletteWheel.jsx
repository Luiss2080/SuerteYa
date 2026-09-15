import { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';

const RouletteWheel = ({ options, isSpinning, setIsSpinning, onResult }) => {
  const canvasRef = useRef(null);
  const [rotation, setRotation] = useState(0);

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
    
    const startTime = performance.now();

    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      
      // easeOutQuart
      const ease = 1 - Math.pow(1 - progress, 4);
      const currentRotation = rotation + (targetAngle - rotation) * ease;
      
      setRotation(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        const arcSize = (2 * Math.PI) / options.length;
        // Adjust for canvas rotation. The pointer is at 0 radians (right side).
        // Since we rotate the wheel clockwise, we need to find which slice is at 0.
        // We normalize the rotation to be between 0 and 2*PI.
        // Because rotation is clockwise, the top slices have moved down.
        const normalizedRotation = currentRotation % (2 * Math.PI);
        const index = Math.floor(((2 * Math.PI) - normalizedRotation) / arcSize) % options.length;
        
        const winner = options[index];
        onResult(winner);
        
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
