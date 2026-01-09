import React, { useEffect, useState } from 'react';
import Matter from 'matter-js';
import Controls from './components/Controls';
import ObjectInspector from './components/ObjectInspector';
import PhysicsCanvas from './components/Canvas/PhysicsCanvas';

const App: React.FC = () => {
    const [selectedBody, setSelectedBody] = useState<Matter.Body | null>(null);
    const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const handleMouseDown = (event: MouseEvent) => {
        const bodies = Matter.Composite.allBodies(engineRef.current.world);
        const mouse = { x: event.clientX, y: event.clientY };
        const clickedBodies = Matter.Query.point(bodies, mouse);
        const nonStaticBodies = clickedBodies.filter(body => !body.isStatic);
        if (nonStaticBodies.length > 0) {
            setSelectedBody(nonStaticBodies[0]);
        }
    };

    useEffect(() => {
        window.addEventListener('mousedown', handleMouseDown);
        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
        };
    }, []);

    return (
        <div className="flex">
            <Controls engine={engineRef.current} />
            <PhysicsCanvas setMousePosition={setMousePosition} />
            {selectedBody && (
                <ObjectInspector body={selectedBody} onClose={() => setSelectedBody(null)} />
            )}
        </div>
    );
};

export default App;