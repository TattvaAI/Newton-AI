import type Matter from 'matter-js';

/**
 * Physics calculations for educational analysis
 */

export interface EnergyData {
  kineticEnergy: number;
  potentialEnergy: number;
  totalEnergy: number;
  timestamp: number;
}

export interface MomentumData {
  momentum: { x: number; y: number };
  magnitude: number;
  timestamp: number;
}

export interface SystemMeasurements {
  totalKineticEnergy: number;
  totalPotentialEnergy: number;
  totalEnergy: number;
  totalMomentum: { x: number; y: number };
  momentumMagnitude: number;
  momentumDirection: number | null;
  objectCount: number;
  averageVelocity: number;
  conservationError: number; // Percentage deviation from initial energy
}

/**
 * Calculate kinetic energy: KE = ½mv²
 */
export function calculateKineticEnergy(body: Matter.Body): number {
  const v = body.velocity;
  const speed = Math.sqrt(v.x * v.x + v.y * v.y);
  return 0.5 * body.mass * speed * speed;
}

/**
 * Calculate potential energy: PE = mgh
 * Using inverted y-axis (canvas coordinates), with ground at y=height
 */
export function calculatePotentialEnergy(
  body: Matter.Body,
  groundY: number,
  gravity = 1
): number {
  const height = groundY - body.position.y;
  return body.mass * gravity * Math.max(0, height);
}

/**
 * Calculate momentum: p = mv
 */
export function calculateMomentum(body: Matter.Body): { x: number; y: number } {
  return {
    x: body.mass * body.velocity.x,
    y: body.mass * body.velocity.y,
  };
}

/**
 * Calculate momentum magnitude
 */
export function calculateMomentumMagnitude(momentum: { x: number; y: number }): number {
  return Math.sqrt(momentum.x * momentum.x + momentum.y * momentum.y);
}

/**
 * Calculate force from acceleration: F = ma
 */
export function calculateForce(mass: number, acceleration: { x: number; y: number }): { x: number; y: number } {
  return {
    x: mass * acceleration.x,
    y: mass * acceleration.y,
  };
}

/**
 * Calculate system-wide measurements for all non-static bodies
 */
export function calculateSystemMeasurements(
  bodies: Matter.Body[],
  groundY: number,
  gravity = 1,
  initialEnergy?: number
): SystemMeasurements {
  const dynamicBodies = bodies.filter(b => !b.isStatic);

  let totalKE = 0;
  let totalPE = 0;
  let totalMomentumX = 0;
  let totalMomentumY = 0;
  let totalSpeed = 0;

  dynamicBodies.forEach(body => {
    totalKE += calculateKineticEnergy(body);
    totalPE += calculatePotentialEnergy(body, groundY, gravity);

    const momentum = calculateMomentum(body);
    totalMomentumX += momentum.x;
    totalMomentumY += momentum.y;

    const speed = Math.sqrt(
      body.velocity.x * body.velocity.x +
      body.velocity.y * body.velocity.y
    );
    totalSpeed += speed;
  });

  const totalEnergy = totalKE + totalPE;
  const conservationError = initialEnergy
    ? Math.abs((totalEnergy - initialEnergy) / initialEnergy) * 100
    : 0;

  const momentumMagnitude = Math.sqrt(totalMomentumX * totalMomentumX + totalMomentumY * totalMomentumY);
  const momentumDirection = momentumMagnitude > 0.01
    ? Math.atan2(totalMomentumY, totalMomentumX) * (180 / Math.PI)
    : null;

  return {
    totalKineticEnergy: totalKE,
    totalPotentialEnergy: totalPE,
    totalEnergy,
    totalMomentum: { x: totalMomentumX, y: totalMomentumY },
    momentumMagnitude,
    momentumDirection,
    objectCount: dynamicBodies.length,
    averageVelocity: dynamicBodies.length > 0 ? totalSpeed / dynamicBodies.length : 0,
    conservationError,
  };
}

/**
 * Verify energy conservation (returns true if within tolerance)
 */
export function verifyEnergyConservation(
  initialEnergy: number,
  currentEnergy: number,
  tolerance = 0.05 // 5% tolerance
): boolean {
  const error = Math.abs(currentEnergy - initialEnergy) / initialEnergy;
  return error <= tolerance;
}

/**
 * Verify momentum conservation
 */
export function verifyMomentumConservation(
  initialMomentum: { x: number; y: number },
  currentMomentum: { x: number; y: number },
  tolerance = 0.05
): boolean {
  const initialMag = calculateMomentumMagnitude(initialMomentum);
  const currentMag = calculateMomentumMagnitude(currentMomentum);

  if (initialMag === 0) return true; // No initial momentum

  const error = Math.abs(currentMag - initialMag) / initialMag;
  return error <= tolerance;
}

/**
 * Calculate collision impulse between two bodies
 */
export function calculateCollisionImpulse(
  body1: Matter.Body,
  _body2: Matter.Body,
  velocityBefore1: { x: number; y: number },
  _velocityBefore2: { x: number; y: number } // eslint-disable-line @typescript-eslint/no-unused-vars
): number {
  const deltaV1x = body1.velocity.x - velocityBefore1.x;
  const deltaV1y = body1.velocity.y - velocityBefore1.y;

  const impulseMagnitude = body1.mass * Math.sqrt(deltaV1x * deltaV1x + deltaV1y * deltaV1y);
  return impulseMagnitude;
}

/**
 * Calculate coefficient of restitution from measured velocities
 */
export function calculateRestitutionCoefficient(
  velocityBefore1: number,
  velocityBefore2: number,
  velocityAfter1: number,
  velocityAfter2: number
): number {
  const relativeVelocityBefore = velocityBefore1 - velocityBefore2;
  const relativeVelocityAfter = velocityAfter2 - velocityAfter1;

  if (relativeVelocityBefore === 0) return 0;

  return Math.abs(relativeVelocityAfter / relativeVelocityBefore);
}

/**
 * Format energy value for display
 */
export function formatEnergy(joules: number): string {
  if (joules < 0.01) return `${(joules * 1000).toFixed(2)} mJ`;
  if (joules < 1) return `${joules.toFixed(3)} J`;
  return `${joules.toFixed(2)} J`;
}

/**
 * Format momentum for display
 */
export function formatMomentum(kgms: number): string {
  if (Math.abs(kgms) < 0.01) return `${(kgms * 1000).toFixed(2)} g⋅m/s`;
  return `${kgms.toFixed(2)} kg⋅m/s`;
}

/**
 * Format velocity for display
 */
export function formatVelocity(ms: number): string {
  if (Math.abs(ms) < 0.01) return `${(ms * 1000).toFixed(2)} mm/s`;
  if (Math.abs(ms) < 1) return `${(ms * 100).toFixed(2)} cm/s`;
  return `${ms.toFixed(2)} m/s`;
}
