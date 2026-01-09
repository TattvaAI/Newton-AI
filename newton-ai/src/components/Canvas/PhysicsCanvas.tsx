import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { Activity, Box, Move, Zap } from 'lucide-react';

interface PhysicsCanvasProps {
  engine: Matter.Engine | null;
  bodies: Matter.Body[];
  onBodySelect: (body: Matter.Body) => void;
}

const PhysicsCanvas: React.FC<PhysicsCanvasProps> = ({ engine, bodies, onBodySelect }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!engine || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    const render = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      bodies.forEach(body => {
        context.beginPath();
        context.arc(body.position.x, body.position.y, 20, 0, Math.PI * 2);
        context.fillStyle = body.isStatic ? 'gray' : 'blue';
        context.fill();
        context.stroke();
      });
    };

    const run = () => {
      Matter.Engine.update(engine);
      render();
      requestAnimationFrame(run);
    };

    run();

    return () => {
      // Cleanup if necessary
    };
  }, [engine, bodies]);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const mousePosition = {
      x: event.clientX,
      y: event.clientY,
    };
    const selectedBody = Matter.Query.point(bodies, mousePosition);
    if (selectedBody.length > 0) {
      onBodySelect(selectedBody[0]);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      onMouseDown={handleMouseDown}
      className="border border-gray-300"
    />
  );
};

export default PhysicsCanvas;