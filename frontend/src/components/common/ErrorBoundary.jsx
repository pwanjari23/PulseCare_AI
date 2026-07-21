/**
 * PulseCare AI - Production ErrorBoundary Component
 */

import React, { Component } from 'react';
import { AlertTriangle, RefreshCw, Home, RotateCcw, ShieldAlert } from 'lucide-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    if (import.meta.env.DEV) {
      console.error('[PulseCare AI ErrorBoundary Caught Error]:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    this.props.onReset?.();
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isDev = import.meta.env.DEV;

      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 sm:p-6 font-sans">
          <div className="w-full max-w-xl bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-2xs">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground font-display">
                  Unexpected Clinical App Error
                </h1>
                <p className="text-xs text-muted-foreground">
                  PulseCare AI safety system prevented an application failure.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-accent/30 border border-border/50 text-xs font-mono space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="font-bold text-rose-500">
                  {this.state.error?.name || 'Runtime Exception'}
                </span>
                <span className="text-[10px]">Error Code: 500-CLIENT</span>
              </div>
              <p className="text-foreground leading-relaxed">
                {this.state.error?.message || 'An unexpected rendering error occurred.'}
              </p>
            </div>

            {isDev && this.state.errorInfo && (
              <details className="text-[11px] font-mono text-muted-foreground space-y-1">
                <summary className="cursor-pointer hover:text-foreground underline">
                  View Development Stack Trace
                </summary>
                <pre className="p-3 rounded-xl bg-black/80 text-emerald-400 overflow-x-auto text-[10px] leading-snug max-h-48 mt-2">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 border-t border-border/40">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-card hover:bg-accent border border-border/60 text-xs font-semibold text-foreground transition-all shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Action</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-accent hover:bg-accent/80 border border-border/60 text-xs font-semibold text-foreground transition-all shadow-2xs"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={this.handleReload}
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Application</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
