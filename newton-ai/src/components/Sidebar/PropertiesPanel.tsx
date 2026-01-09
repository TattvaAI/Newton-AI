import React from 'react';
import { Body } from 'matter-js';
import { Activity, Box, Move, Zap } from 'lucide-react';

interface PropertiesPanelProps {
    body: Body | null;
    onClose: () => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ body, onClose }) => {
    if (!body) {
        return null;
    }

    const { velocity, speed, angularVelocity, mass, friction, restitution, label } = body;

    return (
        <div className="fixed top-0 right-0 w-64 bg-white shadow-lg rounded-lg p-4 z-50">
            <h2 className="text-lg font-bold">{label}</h2>
            <div className="mt-2">
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
            <button onClick={onClose} className="mt-4 bg-red-500 text-white rounded px-4 py-2">
                Close
            </button>
        </div>
    );
};

export default PropertiesPanel;