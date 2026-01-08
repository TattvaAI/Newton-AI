import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-slate-800/90 border border-red-500/50 rounded-2xl p-8 backdrop-blur-md shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-950/50 rounded-xl">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-red-400">System Malfunction</h1>
                <p className="text-slate-400 text-sm mt-1">The simulation encountered a critical error</p>
              </div>
            </div>

            {this.state.error && (
              <div className="bg-slate-950/50 rounded-xl p-4 mb-6 font-mono text-sm">
                <div className="text-red-300 font-semibold mb-2">Error Message:</div>
                <div className="text-red-400 mb-4">{this.state.error.toString()}</div>
                
                {this.state.errorInfo && (
                  <>
                    <div className="text-red-300 font-semibold mb-2">Stack Trace:</div>
                    <div className="text-slate-400 text-xs overflow-auto max-h-48">
                      {this.state.errorInfo.componentStack}
                    </div>
                  </>
                )}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="w-full flex items-center justify-center gap-3 p-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold transition-colors active:scale-95"
            >
              <RefreshCw className="w-5 h-5" />
              Restart Simulation
            </button>

            <div className="mt-4 text-center text-xs text-slate-500">
              If this persists, check the browser console for more details
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
