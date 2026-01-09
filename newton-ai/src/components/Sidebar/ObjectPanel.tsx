import React from 'react';
import { Body } from 'matter-js';
import { Activity, Box, Move, Zap } from 'lucide-react';

interface ObjectInspectorProps {
  body: Body | null;
  onClose: () => void;
}

const ObjectInspector: React.FC<ObjectInspectorProps> = ({ body, onClose }) => {
  const [velocity, setVelocity] = React.useState({ x: 0, y: 0 });
  const [speed, setSpeed] = React.useState(0);
  const [angularVelocity, setAngularVelocity] = React.useState(0);
  const [mass, setMass] = React.useState(0);
  const [friction, setFriction] = React.useState(0);
  const [restitution, setRestitution] = React.useState(0);

  React.useEffect(() => {
    const updateProperties = () => {
      if (body) {
        setVelocity({ x: body.velocity.x, y: body.velocity.y });
        setSpeed(Math.sqrt(body.velocity.x ** 2 + body.velocity.y ** 2));
        setAngularVelocity(body.angularVelocity);
        setMass(body.mass);
        setFriction(body.friction);
        setRestitution(body.restitution);
      }
      requestAnimationFrame(updateProperties);
    };

    updateProperties();
  }, [body]);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 glass-panel">
        <h2 className="text-xl font-bold mb-4">{body?.label || 'Object Inspector'}</h2>
        <div className="mb-2">
          <div className="flex items-center">
            <Activity className="mr-2" />
            <span>Vector Velocity: Vx: {velocity.x.toFixed(2)}, Vy: {velocity.y.toFixed(2)}</span>
          </div>
          <div className="flex items-center">
            <Zap className="mr-2" />
            <span>Speed: {speed.toFixed(2)}</span>
          </div>
          <div className="flex items-center">
            <Move className="mr-2" />
            <span>Angular Velocity: {angularVelocity.toFixed(2)}</span>
          </div>
          <div className="flex items-center">
            <Box className="mr-2" />
            <span>Mass: {mass.toFixed(2)}</span>
          </div>
          <div className="flex items-center">
            <Box className="mr-2" />
            <span>Friction: {friction.toFixed(2)}</span>
          </div>
          <div className="flex items-center">
            <Box className="mr-2" />
            <span>Restitution: {restitution.toFixed(2)}</span>
          </div>
        </div>
        <button onClick={onClose} className="mt-4 bg-blue-500 text-white rounded px-4 py-2">
          Close
        </button>
      </div>
    </div>
  );
};

export default ObjectInspector;