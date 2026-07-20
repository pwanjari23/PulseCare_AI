import React, { Component } from 'react';
import { AlertCircle } from 'lucide-react';
import Button from '../ui/buttons/Button';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught runtime exception:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg flex items-center justify-center p-6 text-primary-text">
          <div className="max-w-md w-full bg-surface border border-border-subtle p-8 rounded-2xl shadow-xl flex flex-col items-center text-center">
            <div className="p-3 rounded-2xl bg-danger-500/10 text-danger-500 border border-danger-500/20 mb-4">
              <AlertCircle className="h-10 w-10" />
            </div>
            <h1 className="font-display font-extrabold text-2xl mb-2">Application Crash</h1>
            <p className="text-secondary-text text-sm mb-6 leading-relaxed">
              A critical rendering error occurred. Our team has been notified. You can try refreshing or resetting your session cache.
            </p>
            <div className="flex gap-3 w-full">
              <Button onClick={this.handleReload} variant="primary" fullWidth>
                Refresh Page
              </Button>
              <Button onClick={this.handleReset} variant="outline" fullWidth>
                Clear Cache & Reset
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <pre className="mt-6 p-4 bg-bg border border-border-subtle rounded-xl text-xs text-left overflow-auto max-h-40 w-full font-mono text-danger-600">
                {this.state.error.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
