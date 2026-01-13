import { useState, useEffect, useCallback } from 'react';
import Matter from 'matter-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { X, Pin, Zap, Move, RotateCcw } from 'lucide-react';

interface ObjectEditorProps {
  body: Matter.Body | null;
  onClose: () => void;
}

export function ObjectEditor({ body, onClose }: ObjectEditorProps) {
  const [mass, setMass] = useState(1);
  const [velocityX, setVelocityX] = useState(0);
  const [velocityY, setVelocityY] = useState(0);
  const [friction, setFriction] = useState(0.1);
  const [restitution, setRestitution] = useState(0.9);
  const [angularVelocity, setAngularVelocity] = useState(0);
  const [isStatic, setIsStatic] = useState(false);

  // Sync with body properties
  useEffect(() => {
    if (!body) return;

    setMass(body.mass);
    setVelocityX(body.velocity.x);
    setVelocityY(body.velocity.y);
    setFriction(body.friction);
    setRestitution(body.restitution);
    setAngularVelocity(body.angularVelocity);
    setIsStatic(body.isStatic);
  }, [body]);

  const applyChanges = useCallback(() => {
    if (!body) return;

    Matter.Body.setMass(body, mass);
    Matter.Body.setVelocity(body, { x: velocityX, y: velocityY });
    Matter.Body.setAngularVelocity(body, angularVelocity);

    body.friction = friction; // eslint-disable-line react-hooks/immutability
    body.restitution = restitution;
  }, [body, mass, velocityX, velocityY, friction, restitution, angularVelocity]);

  // Auto-apply changes whenever values change
  useEffect(() => {
    applyChanges();
  }, [mass, velocityX, velocityY, friction, restitution, angularVelocity, applyChanges]);

  const toggleStatic = useCallback(() => {
    if (!body) return;
    Matter.Body.setStatic(body, !body.isStatic);
    setIsStatic(!body.isStatic);
  }, [body]);

  const stopMotion = useCallback(() => {
    if (!body) return;
    Matter.Body.setVelocity(body, { x: 0, y: 0 });
    Matter.Body.setAngularVelocity(body, 0);
    setVelocityX(0);
    setVelocityY(0);
    setAngularVelocity(0);
  }, [body]);

  const applyForce = useCallback((direction: 'up' | 'down' | 'left' | 'right', magnitude = 0.05) => {
    if (!body || body.isStatic) return;

    const force = { x: 0, y: 0 };
    switch (direction) {
      case 'up':
        force.y = -magnitude;
        break;
      case 'down':
        force.y = magnitude;
        break;
      case 'left':
        force.x = -magnitude;
        break;
      case 'right':
        force.x = magnitude;
        break;
    }

    Matter.Body.applyForce(body, body.position, force);
  }, [body]);

  if (!body) return null;

  const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
  const kineticEnergy = 0.5 * mass * speed * speed;

  return (
    <div className="absolute top-6 right-6 w-96 z-30">
      <Card className="bg-slate-900/95 border-cyan-500/30 backdrop-blur-xl shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border-b border-cyan-900/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-cyan-300 flex items-center gap-2">
                <Move className="w-5 h-5" />
                {body.label || `Body #${body.id}`}
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs mt-1">
                Edit physical properties in real-time
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={toggleStatic}
              variant="outline"
              size="sm"
              className={isStatic ? 'bg-cyan-600/20 border-cyan-500/50' : ''}
            >
              <Pin className="w-4 h-4 mr-2" />
              {isStatic ? 'Unpin' : 'Pin'}
            </Button>
            <Button
              onClick={stopMotion}
              variant="outline"
              size="sm"
              disabled={isStatic}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Stop Motion
            </Button>
          </div>

          {/* Mass */}
          <div className="space-y-2">
            <Label className="text-cyan-400 text-xs font-semibold">Mass (kg)</Label>
            <div className="flex gap-2">
              <Slider
                value={[mass]}
                onValueChange={([v]: number[]) => setMass(v)}
                min={0.1}
                max={100}
                step={0.1}
                className="flex-1"
              />
              <Input
                type="number"
                value={mass.toFixed(1)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const v = parseFloat(e.target.value) || 0.1;
                  setMass(Math.max(0.1, Math.min(100, v)));
                }}
                className="w-20 h-8 text-xs"
              />
            </div>
          </div>

          {/* Velocity */}
          <div className="space-y-2">
            <Label className="text-green-400 text-xs font-semibold">
              Velocity (Speed: {speed.toFixed(2)} px/s)
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-[10px] text-slate-400">X (horizontal)</Label>
                <Input
                  type="number"
                  value={velocityX.toFixed(2)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setVelocityX(parseFloat(e.target.value) || 0);
                  }}
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <Label className="text-[10px] text-slate-400">Y (vertical)</Label>
                <Input
                  type="number"
                  value={velocityY.toFixed(2)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setVelocityY(parseFloat(e.target.value) || 0);
                  }}
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Force Application */}
          {!isStatic && (
            <div className="space-y-2">
              <Label className="text-yellow-400 text-xs font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Apply Force
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => applyForce('up')}
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs"
                >
                  ↑ Up
                </Button>
                <Button
                  onClick={() => applyForce('down')}
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs"
                >
                  ↓ Down
                </Button>
                <Button
                  onClick={() => applyForce('left')}
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs"
                >
                  ← Left
                </Button>
                <Button
                  onClick={() => applyForce('right')}
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs"
                >
                  → Right
                </Button>
              </div>
            </div>
          )}

          {/* Friction */}
          <div className="space-y-2">
            <Label className="text-orange-400 text-xs font-semibold">Friction</Label>
            <div className="flex gap-2">
              <Slider
                value={[friction]}
                onValueChange={([v]: number[]) => setFriction(v)}
                min={0}
                max={1}
                step={0.01}
                className="flex-1"
              />
              <Input
                type="number"
                value={friction.toFixed(2)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const v = parseFloat(e.target.value) || 0;
                  setFriction(Math.max(0, Math.min(1, v)));
                }}
                className="w-20 h-8 text-xs"
              />
            </div>
          </div>

          {/* Restitution (Bounciness) */}
          <div className="space-y-2">
            <Label className="text-pink-400 text-xs font-semibold">Restitution (Bounce)</Label>
            <div className="flex gap-2">
              <Slider
                value={[restitution]}
                onValueChange={([v]: number[]) => setRestitution(v)}
                min={0}
                max={1}
                step={0.01}
                className="flex-1"
              />
              <Input
                type="number"
                value={restitution.toFixed(2)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const v = parseFloat(e.target.value) || 0;
                  setRestitution(Math.max(0, Math.min(1, v)));
                }}
                className="w-20 h-8 text-xs"
              />
            </div>
          </div>

          {/* Angular Velocity */}
          <div className="space-y-2">
            <Label className="text-purple-400 text-xs font-semibold">Angular Velocity (rad/s)</Label>
            <div className="flex gap-2">
              <Slider
                value={[angularVelocity]}
                onValueChange={([v]: number[]) => setAngularVelocity(v)}
                min={-0.5}
                max={0.5}
                step={0.01}
                className="flex-1"
              />
              <Input
                type="number"
                value={angularVelocity.toFixed(3)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setAngularVelocity(parseFloat(e.target.value) || 0);
                }}
                className="w-20 h-8 text-xs"
              />
            </div>
          </div>

          {/* Live Measurements */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <Label className="text-slate-400 text-xs font-semibold">Live Measurements</Label>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="bg-slate-950/50 p-2 rounded">
                <div className="text-slate-500">Position</div>
                <div className="text-cyan-300">
                  ({body.position.x.toFixed(0)}, {body.position.y.toFixed(0)})
                </div>
              </div>
              <div className="bg-slate-950/50 p-2 rounded">
                <div className="text-slate-500">KE</div>
                <div className="text-green-300">{kineticEnergy.toFixed(2)} J</div>
              </div>
              <div className="bg-slate-950/50 p-2 rounded">
                <div className="text-slate-500">Angle</div>
                <div className="text-purple-300">{(body.angle * 180 / Math.PI).toFixed(1)}°</div>
              </div>
              <div className="bg-slate-950/50 p-2 rounded">
                <div className="text-slate-500">Area</div>
                <div className="text-slate-300">{body.area.toFixed(0)} px²</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
