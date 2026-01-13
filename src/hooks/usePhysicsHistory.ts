import { useState, useEffect, useRef, useCallback } from 'react';
import type Matter from 'matter-js';
import type { SystemMeasurements } from '../lib/calculations/physics-math';
import { calculateSystemMeasurements } from '../lib/calculations/physics-math';

export interface PhysicsSnapshot {
  timestamp: number;
  time: number; // Simulation time in seconds
  measurements: SystemMeasurements;
  bodies: Array<{
    id: number;
    label: string;
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    angularVelocity: number;
    kineticEnergy: number;
    mass: number;
  }>;
}

interface UsePhysicsHistoryOptions {
  maxSnapshots?: number;
  samplingRate?: number; // Samples per second (default 10)
  enabled?: boolean;
}

export function usePhysicsHistory(
  engine: Matter.Engine | null,
  options: UsePhysicsHistoryOptions = {}
) {
  const {
    maxSnapshots = 10000,
    samplingRate = 10,
    enabled = true
  } = options;

  const [history, setHistory] = useState<PhysicsSnapshot[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const initialEnergyRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const lastSnapshotTimeRef = useRef<number>(0);

  const samplingInterval = 1000 / samplingRate;

  // Start recording
  const startRecording = useCallback(() => {
    if (!engine) return;
    
    setHistory([]);
    startTimeRef.current = performance.now();
    lastSnapshotTimeRef.current = 0;
    
    // Calculate initial energy for conservation tracking
    const groundY = window.innerHeight;
    const initial = calculateSystemMeasurements(engine.world.bodies, groundY);
    initialEnergyRef.current = initial.totalEnergy;
    
    setIsRecording(true);
  }, [engine]);

  // Stop recording
  const stopRecording = useCallback(() => {
    setIsRecording(false);
  }, []);

  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([]);
    initialEnergyRef.current = null;
    startTimeRef.current = 0;
    lastSnapshotTimeRef.current = 0;
  }, []);

  // Record physics state
  useEffect(() => {
    if (!engine || !isRecording || !enabled) return;

    let animationFrameId: number;
    const groundY = window.innerHeight;

    const recordFrame = () => {
      const now = performance.now();
      const elapsed = now - startTimeRef.current;
      const sinceLastSnapshot = now - lastSnapshotTimeRef.current;

      // Only sample at specified rate
      if (sinceLastSnapshot >= samplingInterval) {
        const measurements = calculateSystemMeasurements(
          engine.world.bodies,
          groundY,
          1,
          initialEnergyRef.current || undefined
        );

        const snapshot: PhysicsSnapshot = {
          timestamp: now,
          time: elapsed / 1000, // Convert to seconds
          measurements,
          bodies: engine.world.bodies
            .filter(b => !b.isStatic)
            .map(body => ({
              id: body.id,
              label: body.label || `Body ${body.id}`,
              position: { ...body.position },
              velocity: { ...body.velocity },
              angularVelocity: body.angularVelocity,
              kineticEnergy: 0.5 * body.mass * (
                body.velocity.x * body.velocity.x + 
                body.velocity.y * body.velocity.y
              ),
              mass: body.mass,
            })),
        };

        setHistory(prev => {
          const newHistory = [...prev, snapshot];
          // Limit history size (circular buffer behavior)
          if (newHistory.length > maxSnapshots) {
            return newHistory.slice(-maxSnapshots);
          }
          return newHistory;
        });

        lastSnapshotTimeRef.current = now;
      }

      animationFrameId = requestAnimationFrame(recordFrame);
    };

    animationFrameId = requestAnimationFrame(recordFrame);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [engine, isRecording, enabled, samplingInterval, maxSnapshots]);

  // Get data for a specific time range
  const getTimeRange = useCallback((startTime: number, endTime: number) => {
    return history.filter(
      snapshot => snapshot.time >= startTime && snapshot.time <= endTime
    );
  }, [history]);

  // Get latest snapshot
  const getLatest = useCallback(() => {
    return history[history.length - 1] || null;
  }, [history]);

  // Export to CSV format
  const exportToCSV = useCallback(() => {
    if (history.length === 0) return '';

    const headers = [
      'Time (s)',
      'Total KE (J)',
      'Total PE (J)',
      'Total Energy (J)',
      'Momentum X (kg⋅m/s)',
      'Momentum Y (kg⋅m/s)',
      'Momentum Magnitude',
      'Object Count',
      'Avg Velocity (m/s)',
      'Conservation Error (%)'
    ];

    const rows = history.map(snapshot => [
      snapshot.time.toFixed(3),
      snapshot.measurements.totalKineticEnergy.toFixed(4),
      snapshot.measurements.totalPotentialEnergy.toFixed(4),
      snapshot.measurements.totalEnergy.toFixed(4),
      snapshot.measurements.totalMomentum.x.toFixed(4),
      snapshot.measurements.totalMomentum.y.toFixed(4),
      snapshot.measurements.momentumMagnitude.toFixed(4),
      snapshot.measurements.objectCount,
      snapshot.measurements.averageVelocity.toFixed(4),
      snapshot.measurements.conservationError.toFixed(2),
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }, [history]);

  // Get statistics
  const getStatistics = useCallback(() => {
    if (history.length === 0) return null;

    const energies = history.map(s => s.measurements.totalEnergy);
    const maxEnergy = Math.max(...energies);
    const minEnergy = Math.min(...energies);
    const avgEnergy = energies.reduce((a, b) => a + b, 0) / energies.length;
    
    const velocities = history.map(s => s.measurements.averageVelocity);
    const maxVelocity = Math.max(...velocities);
    const avgVelocity = velocities.reduce((a, b) => a + b, 0) / velocities.length;

    return {
      duration: history[history.length - 1].time,
      dataPoints: history.length,
      energy: {
        max: maxEnergy,
        min: minEnergy,
        average: avgEnergy,
        range: maxEnergy - minEnergy,
      },
      velocity: {
        max: maxVelocity,
        average: avgVelocity,
      },
      initialEnergy: initialEnergyRef.current,
      energyConserved: initialEnergyRef.current 
        ? Math.abs(avgEnergy - initialEnergyRef.current) / initialEnergyRef.current < 0.05
        : true,
    };
  }, [history]);

  return {
    history,
    isRecording,
    startRecording,
    stopRecording,
    clearHistory,
    getTimeRange,
    getLatest,
    exportToCSV,
    getStatistics,
  };
}
