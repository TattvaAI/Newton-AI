import { useState, useEffect } from 'react';
import type Matter from 'matter-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Zap, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { calculateSystemMeasurements, formatEnergy, formatMomentum, formatVelocity, type SystemMeasurements } from '@/lib/calculations/physics-math';

interface PhysicsDashboardProps {
  engine: Matter.Engine | null;
  groundY: number;
  gravity?: number;
  initialEnergy?: number;
  className?: string;
  selectedBody?: Matter.Body | null;
}

export function PhysicsDashboard({
  engine,
  groundY,
  gravity = 1,
  initialEnergy,
  className = '',
  selectedBody = null,
}: PhysicsDashboardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [measurements, setMeasurements] = useState<SystemMeasurements | null>(null);

  // Real-time updates using requestAnimationFrame
  useEffect(() => {
    if (!engine) return;

    let animationFrameId: number;

    const updateMeasurements = () => {
      const newMeasurements = calculateSystemMeasurements(
        engine.world.bodies,
        groundY,
        gravity,
        initialEnergy
      );
      setMeasurements(newMeasurements);
      animationFrameId = requestAnimationFrame(updateMeasurements);
    };

    updateMeasurements();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [engine, groundY, gravity, initialEnergy]);

  if (!measurements || !engine) {
    return (
      <div className={`${className} opacity-50`}>
        <Card className="bg-slate-900/50 border-slate-700/30">
          <CardContent className="p-4 text-center text-slate-500">
            <Activity className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">No simulation running</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-cyan-500/30 backdrop-blur-xl shadow-2xl">
        <CardHeader
          className="bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border-b border-cyan-900/50 pb-3 cursor-pointer hover:bg-cyan-900/30 transition-colors"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-cyan-300 text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 animate-pulse" />
                Physics Dashboard
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs mt-1">
                Real-time system measurements • Live updating
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] text-slate-500">Objects</div>
                <div className="text-2xl font-bold text-cyan-400 tabular-nums">{measurements.objectCount}</div>
              </div>
              <button className="text-cyan-400 hover:text-cyan-300 transition-colors">
                {isCollapsed ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </CardHeader>

        {!isCollapsed && (
          <CardContent className="p-4 space-y-4">
            {/* Selected Object Indicator */}
            {selectedBody && (
              <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-cyan-400">
                    ✏️ Editing: <span className="font-bold">{selectedBody.label || `Body #${selectedBody.id}`}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 tabular-nums">
                    Mass: <span className="text-cyan-300 font-bold">{selectedBody.mass.toFixed(1)}</span> kg •
                    Speed: <span className="text-green-300 font-bold">
                      {Math.sqrt(selectedBody.velocity.x ** 2 + selectedBody.velocity.y ** 2).toFixed(2)}
                    </span> px/s
                  </div>
                </div>
              </div>
            )}

            {!selectedBody && (
              <div className="bg-slate-800/50 border border-slate-700/30 rounded-lg p-2">
                <div className="text-xs text-slate-400 text-center">
                  💡 Click any object to edit its properties
                </div>
              </div>
            )}

            {/* Energy Panel */}
            {/* Energy Panel */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-green-400">
                <Zap className="w-4 h-4" />
                Energy Analysis
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-700/30 rounded-lg p-3">
                  <div className="text-[10px] text-green-500 font-semibold mb-1">KINETIC ENERGY</div>
                  <div className="text-xl font-bold text-green-300 tabular-nums">
                    {formatEnergy(measurements.totalKineticEnergy)}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Avg velocity: {formatVelocity(measurements.averageVelocity)}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-700/30 rounded-lg p-3">
                  <div className="text-[10px] text-blue-500 font-semibold mb-1">POTENTIAL ENERGY</div>
                  <div className="text-xl font-bold text-blue-300 tabular-nums">
                    {formatEnergy(measurements.totalPotentialEnergy)}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Gravitational (g = {gravity})
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-700/30 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-[10px] text-purple-500 font-semibold">TOTAL MECHANICAL ENERGY</div>
                </div>
                <div className="text-2xl font-bold text-purple-300 tabular-nums">
                  {formatEnergy(measurements.totalEnergy)}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  KE + PE = {measurements.totalKineticEnergy.toFixed(2)} + {measurements.totalPotentialEnergy.toFixed(2)} J
                </div>
              </div>
            </div>

            {/* Momentum Panel */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-cyan-400">
                <TrendingUp className="w-4 h-4" />
                Momentum Analysis
              </div>

              <div className="bg-gradient-to-br from-cyan-900/20 to-cyan-800/10 border border-cyan-700/30 rounded-lg p-3">
                <div className="text-[10px] text-cyan-500 font-semibold mb-2">TOTAL MOMENTUM VECTOR</div>

                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div>
                    <div className="text-[9px] text-slate-500">X-component</div>
                    <div className="text-sm font-bold text-cyan-300">
                      {measurements.totalMomentum.x.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-500">Y-component</div>
                    <div className="text-sm font-bold text-cyan-300">
                      {measurements.totalMomentum.y.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-500">Magnitude</div>
                    <div className="text-sm font-bold text-cyan-200">
                      {formatMomentum(measurements.momentumMagnitude)}
                    </div>
                  </div>
                </div>

                {measurements.momentumDirection !== null && (
                  <div className="text-[10px] text-slate-400">
                    Direction: {measurements.momentumDirection.toFixed(1)}° from horizontal
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="pt-2 border-t border-slate-800/50">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-[9px] text-slate-500 uppercase">Max KE</div>
                  <div className="text-xs font-bold text-green-400">
                    {measurements.objectCount > 0 ?
                      formatEnergy(measurements.totalKineticEnergy / measurements.objectCount) : '0 J'}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-500 uppercase">Avg Mass</div>
                  <div className="text-xs font-bold text-slate-300">
                    {measurements.objectCount > 0 ?
                      (engine.world.bodies.filter(b => !b.isStatic).reduce((sum, b) => sum + b.mass, 0) / measurements.objectCount).toFixed(1) : '0'} kg
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-500 uppercase">Active</div>
                  <div className="text-xs font-bold text-cyan-400">
                    {engine.world.bodies.filter(b => !b.isStatic && b.speed > 0.1).length}/{measurements.objectCount}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
