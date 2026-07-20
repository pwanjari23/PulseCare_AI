import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';

// Pages
import Home from '../pages/Home';
import DesignSystem from '../pages/DesignSystem';

// System Components
import NotFound from '../components/system/NotFound';
import Unauthorized from '../components/system/Unauthorized';

// Modular Routes
import AuthRoutes from './AuthRoutes';
import DashboardRoutes from './DashboardRoutes';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>

      {/* Modularized Auth Routes */}
      {AuthRoutes}

      {/* Modularized Protected Dashboard Routes */}
      {DashboardRoutes}

      {/* Design System Playground */}
      <Route path="/design-system" element={<DesignSystem />} />

      {/* 404 Catch All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
