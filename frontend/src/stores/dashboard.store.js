import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useDashboardStore = create(
  persist(
    (set) => ({
      // State
      collapsedWidgets: {},
      preferredChartRange: '30', // '7' | '30' | '90' | '365'
      notificationFilter: 'all',
      layoutDensity: 'comfortable', // 'compact' | 'comfortable'

      // Actions
      toggleWidgetCollapse: (widgetId) =>
        set((state) => ({
          collapsedWidgets: {
            ...state.collapsedWidgets,
            [widgetId]: !state.collapsedWidgets[widgetId],
          },
        })),

      setPreferredChartRange: (range) => set({ preferredChartRange: range }),

      setNotificationFilter: (filter) => set({ notificationFilter: filter }),

      setLayoutDensity: (density) => set({ layoutDensity: density }),

      resetPreferences: () =>
        set({
          collapsedWidgets: {},
          preferredChartRange: '30',
          notificationFilter: 'all',
          layoutDensity: 'comfortable',
        }),
    }),
    {
      name: 'pulsecare_dashboard_preferences',
    }
  )
);

export default useDashboardStore;
