import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { logger } from '../lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private resetTimeout: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('🚨 ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Call optional error handler
    this.props.onError?.(error, errorInfo);

    // Auto-reset after 10 seconds if error count is low
    if (this.state.errorCount < 3) {
      this.resetTimeout = window.setTimeout(() => {
        this.handleSoftReset();
      }, 10000);
    }
  }

  componentWillUnmount() {
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
    }
  }

  handleSoftReset = () => {
    // Clear error state without reloading
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    this.props.onReset?.();
  };

  handleHardReset = () => {
    // Clear localStorage and reload
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      logger.error('Failed to clear storage:', e);
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isRecurring = this.state.errorCount >= 3;

      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-slate-800/90 border border-red-500/50 rounded-2xl p-8 backdrop-blur-md shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-950/50 rounded-xl">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-red-400">
                  {isRecurring ? 'Critical System Error' : 'System Malfunction'}
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  {isRecurring 
                    ? 'Multiple errors detected - full reset recommended'
                    : 'The simulation encountered an error'}
                </p>
              </div>
            </div>

            {this.state.error && (
              <div className="bg-slate-950/50 rounded-xl p-4 mb-6 font-mono text-sm">
                <div className="text-red-300 font-semibold mb-2">Error Message:</div>
                <div className="text-red-400 mb-4">{this.state.error.toString()}</div>
                
                {this.state.errorInfo && import.meta.env.DEV && (
                  <>
                    <div className="text-red-300 font-semibold mb-2">Stack Trace:</div>
                    <div className="text-slate-400 text-xs overflow-auto max-h-48">
                      {this.state.errorInfo.componentStack}
                    </div>
                  </>
                )}
              </div>
            )}

            {isRecurring && (
              <div className="bg-yellow-950/30 border border-yellow-500/30 rounded-xl p-4 mb-6">
                <p className="text-yellow-400 text-sm">
                  ⚠️ This error keeps occurring. A full reset will clear all saved data and refresh the page.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              {!isRecurring && (
                <button
                  onClick={this.handleSoftReset}
                  className="flex-1 flex items-center justify-center gap-3 p-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold transition-colors active:scale-95"
                >
                  <RefreshCw className="w-5 h-5" />
                  Try Again
                </button>
              )}
              <button
                onClick={this.handleHardReset}
                className="flex-1 flex items-center justify-center gap-3 p-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-semibold transition-colors active:scale-95"
              >
                <Home className="w-5 h-5" />
                {isRecurring ? 'Full Reset' : 'Restart'}
              </button>
            </div>

            {!isRecurring && (
              <div className="mt-4 text-center text-xs text-slate-500">
                Auto-recovering in 10 seconds... (Error #{this.state.errorCount})
              </div>
            )}

            <div className="mt-4 text-center text-xs text-slate-500">
              {import.meta.env.DEV 
                ? 'Check the browser console for more details'
                : 'If this persists, please refresh the page'}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
