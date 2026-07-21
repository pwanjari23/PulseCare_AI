import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';

// Pages
import Home from '../pages/Home';
import DesignSystem from '../pages/DesignSystem';

import NotFoundPage from '../pages/error/NotFoundPage';
import ForbiddenPage from '../pages/error/ForbiddenPage';
import ServerErrorPage from '../pages/error/ServerErrorPage';
import OfflinePage from '../pages/error/OfflinePage';
import SessionExpiredPage from '../pages/error/SessionExpiredPage';

// Modular Routes
import AuthRoutes from './AuthRoutes';
import DashboardRoutes from './DashboardRoutes';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/unauthorized" element={<ForbiddenPage />} />
        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="/500" element={<ServerErrorPage />} />
        <Route path="/offline" element={<OfflinePage />} />
        <Route path="/session-expired" element={<SessionExpiredPage />} />
      </Route>

      {/* Modularized Auth Routes */}
      {AuthRoutes}

      {/* Modularized Protected Dashboard Routes */}
      {DashboardRoutes}

      {/* Design System Playground */}
      <Route path="/design-system" element={<DesignSystem />} />

      {/* 404 Catch All */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
