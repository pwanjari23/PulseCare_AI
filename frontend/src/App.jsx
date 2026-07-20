import React from 'react';
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/system/ErrorBoundary';
import ThemeProvider from './providers/ThemeProvider';
import QueryProvider from './providers/QueryProvider';
import AuthProvider from './providers/AuthProvider';
import ToastProvider from './providers/ToastProvider';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QueryProvider>
          <AuthProvider>
            <ToastProvider />
            <AppRoutes />
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
