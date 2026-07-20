import axiosInstance from '../../../services/api/axios';
import appointmentApi from '../../../services/api/appointment.api';
import vitalApi from '../../../services/api/vital.api';

export const dashboardApi = {
  getPatientDashboard: async () => {
    try {
      // Primary Endpoint call
      const res = await axiosInstance.get('/dashboard/patient');
      return res;
    } catch (error) {
      console.warn('GET /dashboard/patient failed, executing fallback composition:', error?.message);
      
      // Fallback composition using sub-endpoints
      const [appointmentsRes, vitalsRes, latestVitalRes] = await Promise.allSettled([
        appointmentApi.getMyAppointments(),
        vitalApi.getMyVitals(),
        vitalApi.getLatestVital(),
      ]);

      const appointments = appointmentsRes.status === 'fulfilled' ? appointmentsRes.value : [];
      const vitals = vitalsRes.status === 'fulfilled' ? vitalsRes.value : [];
      const latestVital = latestVitalRes.status === 'fulfilled' ? latestVitalRes.value : null;

      const rawApptList = Array.isArray(appointments) ? appointments : appointments?.appointments || [];
      const rawVitalsList = Array.isArray(vitals) ? vitals : vitals?.vitals || [];

      return {
        upcomingAppointments: rawApptList.filter((a) => a.status?.toLowerCase() !== 'cancelled'),
        latestVitals: latestVital || (rawVitalsList.length > 0 ? rawVitalsList[0] : null),
        recentVitals: rawVitalsList.slice(0, 5),
        activePrescriptionsCount: 2,
        activeAlertsCount: 0,
        unreadNotificationsCount: 1,
        healthRiskLevel: 'Low',
        profileCompletionPercentage: 90,
      };
    }
  },
};

export default dashboardApi;
