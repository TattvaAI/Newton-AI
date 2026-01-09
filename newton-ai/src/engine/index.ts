import Matter from 'matter-js';

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;

const createPhysicsEngine = () => {
    const engine = Engine.create();
    const render = Render.create({
        element: document.getElementById('canvas-container') as HTMLElement,
        engine: engine,
        options: {
            width: 800,
            height: 600,
            wireframes: false,
        },
    });

    Render.run(render);
    Engine.run(engine);

    return { engine, render };
};

export default createPhysicsEngine;