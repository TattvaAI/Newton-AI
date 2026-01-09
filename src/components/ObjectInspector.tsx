import { useEffect, useState } from 'react';
import { Activity, Box, Move, Zap, X } from 'lucide-react';
import Matter from 'matter-js';

interface ObjectInspectorProps {
  body: Matter.Body | null;
  onClose: () => void;
}

interface PhysicsData {
  vx: number;
  vy: number;
  speed: number;
  angularVelocity: number;
  mass: number;
  friction: number;
  restitution: number;
}

export function ObjectInspector({ body, onClose }: ObjectInspectorProps) {
  const [data, setData] = useState<PhysicsData | null>(null);

  useEffect(() => {
    if (!body) return;

    let animationFrameId: number;

    const updateData = () => {
      const velocity = body.velocity;
      const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);

      setData({
        vx: velocity.x,
        vy: velocity.y,
        speed: speed,
        angularVelocity: body.angularVelocity,
        mass: body.mass,
        friction: body.friction,
        restitution: body.restitution,
      });

      animationFrameId = requestAnimationFrame(updateData);
    };

    updateData();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [body]);

  if (!body || !data) return null;

  return (
    <div className="absolute top-6 left-6 z-20 w-80">
      <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-cyan-500/30 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cyan-900/50 bg-gradient-to-r from-cyan-900/20 to-purple-900/20">
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-cyan-300">
              {body.label || 'Body'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-lg transition-colors"
            title="Close Inspector"
          >
            <X className="w-5 h-5 text-slate-400 hover:text-cyan-400" />
          </button>
        </div>

        {/* Data Grid */}
        <div className="p-4 space-y-3">
          {/* Velocity Vector */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold">
              <Move className="w-4 h-4" />
              <span>VECTOR VELOCITY</span>
            </div>
            <div className="pl-6 space-y-1 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Vx:</span>
                <span className="text-cyan-300">{data.vx.toFixed(2)} px/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Vy:</span>
                <span className="text-cyan-300">{data.vy.toFixed(2)} px/s</span>
              </div>
            </div>
          </div>

          {/* Speed */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-green-400 font-semibold">
              <Zap className="w-4 h-4" />
              <span>SPEED</span>
            </div>
            <div className="pl-6 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Magnitude:</span>
                <span className="text-green-300">{data.speed.toFixed(2)} px/s</span>
              </div>
            </div>
          </div>

          {/* Angular Velocity */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-purple-400 font-semibold">
              <Activity className="w-4 h-4" />
              <span>ANGULAR VELOCITY</span>
            </div>
            <div className="pl-6 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Rotation:</span>
                <span className="text-purple-300">{data.angularVelocity.toFixed(3)} rad/s</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-800 my-3" />

          {/* Physical Properties */}
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Mass:</span>
              <span className="text-slate-200">{data.mass.toFixed(2)} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Friction:</span>
              <span className="text-slate-200">{data.friction.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Restitution:</span>
              <span className="text-slate-200">{data.restitution.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-cyan-500/20" />
      </div>
    </div>
  );
}
