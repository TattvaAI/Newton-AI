import { AlertTriangle, Info, CheckCircle } from 'lucide-react';
import type { Toast as ToastType } from '../types';

interface ToastContainerProps {
  toasts: ToastType[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-md px-4 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: ToastType; onRemove: (id: string) => void }) {
  const getIcon = () => {
    switch (toast.type) {
      case 'error':
        return <AlertTriangle size={18} className="text-red-400" />;
      case 'success':
        return <CheckCircle size={18} className="text-green-400" />;
      default:
        return <Info size={18} className="text-cyan-400" />;
    }
  };

  const getStyles = () => {
    switch (toast.type) {
      case 'error':
        return 'bg-red-950/80 border-red-500/50 text-red-100';
      case 'success':
        return 'bg-green-950/80 border-green-500/50 text-green-100';
      default:
        return 'bg-slate-800/90 border-cyan-500/30 text-cyan-50';
    }
  };

  return (
    <div
      className={`
        pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg 
        animate-in fade-in slide-in-from-bottom-5 cursor-pointer
        ${getStyles()}
      `}
      onClick={() => onRemove(toast.id)}
    >
      <div className="mt-0.5">{getIcon()}</div>
      <div className="flex-1">
        <h4 className="font-bold text-sm tracking-wide">{toast.title}</h4>
        {toast.message && (
          <p className="text-xs opacity-80 mt-1 font-mono">{toast.message}</p>
        )}
      </div>
    </div>
  );
}
