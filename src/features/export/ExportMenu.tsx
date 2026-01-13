import { Download, Image, FileCode, Copy } from 'lucide-react';
import { useState } from 'react';
import Matter from 'matter-js';
import { exportAsPNG, exportAsJPG, exportCode, copyToClipboard } from '../../lib/export';

interface ExportMenuProps {
  render: Matter.Render | null;
  lastGeneratedCode: string | null;
  onClose: () => void;
}

export function ExportMenu({ render, lastGeneratedCode, onClose }: ExportMenuProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleExportPNG = async () => {
    if (!render) return;
    setIsExporting(true);
    try {
      await exportAsPNG(render);
      setMessage('✅ PNG exported successfully!');
      setTimeout(() => setMessage(null), 2000);
    } catch (error) {
      setMessage('❌ Export failed');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJPG = async () => {
    if (!render) return;
    setIsExporting(true);
    try {
      await exportAsJPG(render);
      setMessage('✅ JPG exported successfully!');
      setTimeout(() => setMessage(null), 2000);
    } catch (error) {
      setMessage('❌ Export failed');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCode = () => {
    if (!lastGeneratedCode) return;
    exportCode(lastGeneratedCode);
    setMessage('✅ Code exported successfully!');
    setTimeout(() => setMessage(null), 2000);
  };

  const handleCopyToClipboard = async () => {
    if (!render) return;
    setIsExporting(true);
    try {
      await copyToClipboard(render);
      setMessage('✅ Copied to clipboard!');
      setTimeout(() => setMessage(null), 2000);
    } catch (error) {
      setMessage('❌ Clipboard not supported');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="absolute top-20 right-6 w-64 bg-slate-800/95 backdrop-blur-xl border border-cyan-900/50 rounded-2xl p-4 shadow-2xl z-20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-cyan-400 font-semibold flex items-center gap-2">
          <Download size={18} />
          Export
        </h3>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-cyan-400 transition-colors"
        >
          ✕
        </button>
      </div>

      {message && (
        <div className="mb-3 p-2 bg-slate-700/50 rounded-lg text-sm text-center">
          {message}
        </div>
      )}

      <div className="space-y-2">
        <button
          onClick={handleExportPNG}
          disabled={!render || isExporting}
          className="w-full flex items-center gap-3 p-3 bg-slate-700/50 hover:bg-slate-700 text-cyan-400 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Image size={18} />
          <span>Export as PNG</span>
        </button>

        <button
          onClick={handleExportJPG}
          disabled={!render || isExporting}
          className="w-full flex items-center gap-3 p-3 bg-slate-700/50 hover:bg-slate-700 text-cyan-400 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Image size={18} />
          <span>Export as JPG</span>
        </button>

        <button
          onClick={handleCopyToClipboard}
          disabled={!render || isExporting}
          className="w-full flex items-center gap-3 p-3 bg-slate-700/50 hover:bg-slate-700 text-cyan-400 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Copy size={18} />
          <span>Copy to Clipboard</span>
        </button>

        <div className="border-t border-slate-700 my-2" />

        <button
          onClick={handleExportCode}
          disabled={!lastGeneratedCode}
          className="w-full flex items-center gap-3 p-3 bg-slate-700/50 hover:bg-slate-700 text-purple-400 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileCode size={18} />
          <span>Export Code</span>
        </button>
      </div>

      <p className="text-xs text-slate-500 mt-4 text-center">
        {isExporting ? 'Exporting...' : 'Choose export format'}
      </p>
    </div>
  );
}
