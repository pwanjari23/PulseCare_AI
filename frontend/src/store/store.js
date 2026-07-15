import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add modular slices here when implementing vitals, prescriptions, etc.
  },
});

export default store;
// Export types if typescript is introduced, or keep clean imports for standard RTK
