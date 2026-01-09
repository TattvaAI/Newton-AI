// This file defines the types used in the physics simulation for the Newton-AI project.

export interface Vector {
    x: number;
    y: number;
}

export interface BodyProperties {
    label: string;
    velocity: Vector;
    speed: number;
    angularVelocity: number;
    mass: number;
    friction: number;
    restitution: number;
}

export interface SimulationSettings {
    gravity: number;
    timeScale: number;
    airDensity: number;
    wind: number;
}