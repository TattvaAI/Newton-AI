import Matter from 'matter-js';

class PhysicsEngine {
    private engine: Matter.Engine;
    private world: Matter.World;

    constructor() {
        this.engine = Matter.Engine.create();
        this.world = this.engine.world;
        this.setup();
    }

    private setup() {
        // Set default gravity
        this.engine.gravity.y = 1;

        // Additional setup can be done here
    }

    public update() {
        Matter.Engine.update(this.engine);
    }

    public addBody(body: Matter.Body) {
        Matter.World.add(this.world, body);
    }

    public removeBody(body: Matter.Body) {
        Matter.World.remove(this.world, body);
    }

    public getBodies() {
        return Matter.Composite.allBodies(this.world);
    }

    public setGravity(x: number, y: number) {
        this.engine.gravity.x = x;
        this.engine.gravity.y = y;
    }

    public setTimeScale(scale: number) {
        this.engine.timing.timeScale = scale;
    }

    public getEngine() {
        return this.engine;
    }
}

export default PhysicsEngine;