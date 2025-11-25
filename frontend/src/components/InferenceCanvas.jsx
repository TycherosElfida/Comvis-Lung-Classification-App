import React, { useRef, useEffect, useState } from 'react';

const InferenceCanvas = ({ imageSrc, predictions, showConfidence = true, showLabels = true }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [hoveredBox, setHoveredBox] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  // Load image to get natural dimensions
  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height });
    };
  }, [imageSrc]);

  // Draw boxes
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !imageSize.width) return;

    const ctx = canvas.getContext('2d');
    
    // Match canvas size to container (responsive)
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!predictions) return;

    predictions.forEach((pred, index) => {
      if (!pred.box) return;
      const [x, y, w, h] = pred.box;
      
      // Convert normalized coordinates to pixel coordinates
      const rectX = x * canvas.width;
      const rectY = y * canvas.height;
      const rectW = w * canvas.width;
      const rectH = h * canvas.height;

      // Draw Box
      ctx.strokeStyle = hoveredBox === index ? '#00ffff' : '#3b82f6'; // Cyan on hover, Blue default
      ctx.lineWidth = hoveredBox === index ? 3 : 2;
      ctx.shadowColor = hoveredBox === index ? 'rgba(0, 255, 255, 0.5)' : 'transparent';
      ctx.shadowBlur = 10;
      ctx.strokeRect(rectX, rectY, rectW, rectH);

      // Draw Label Background
      if (showLabels || hoveredBox === index) {
        ctx.fillStyle = hoveredBox === index ? '#00ffff' : '#3b82f6';
        const text = `${pred.label} ${showConfidence ? `(${(pred.score * 100).toFixed(0)}%)` : ''}`;
        const textWidth = ctx.measureText(text).width + 10;
        ctx.fillRect(rectX, rectY - 24, textWidth, 24);

        // Draw Label Text
        ctx.fillStyle = '#000';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.fillText(text, rectX + 5, rectY - 8);
      }
    });
  }, [predictions, hoveredBox, imageSize, showConfidence, showLabels]);

  const handleMouseMove = (e) => {
    if (!predictions || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Check intersection with any box
    // We iterate in reverse to pick the top-most box if they overlap
    let found = null;
    const canvasWidth = canvasRef.current.width;
    const canvasHeight = canvasRef.current.height;

    for (let i = predictions.length - 1; i >= 0; i--) {
      const [x, y, w, h] = predictions[i].box;
      const boxX = x * canvasWidth;
      const boxY = y * canvasHeight;
      const boxW = w * canvasWidth;
      const boxH = h * canvasHeight;

      if (mouseX >= boxX && mouseX <= boxX + boxW && mouseY >= boxY && mouseY <= boxY + boxH) {
        found = i;
        break;
      }
    }
    setHoveredBox(found);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full rounded-xl overflow-hidden bg-black">
      <img 
        src={imageSrc} 
        alt="Analysis" 
        className="absolute inset-0 w-full h-full object-contain opacity-80" 
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredBox(null)}
      />
    </div>
  );
};

export default InferenceCanvas;
