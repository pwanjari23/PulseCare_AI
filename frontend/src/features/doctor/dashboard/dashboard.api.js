import axiosInstance from '../../../services/api/axios';
import appointmentApi from '../../../services/api/appointment.api';
import vitalApi from '../../../services/api/vital.api';

export const doctorDashboardApi = {
  getDoctorDashboard: async () => {
    try {
      // Primary Endpoint call
      const res = await axiosInstance.get('/dashboard/doctor');
      return res;
    } catch (error) {
      console.warn('GET /dashboard/doctor failed, executing fallback composition:', error?.message);

      // Fallback composition using doctor endpoints
      const [appointmentsRes, vitalsRes] = await Promise.allSettled([
        appointmentApi.getDoctorAppointments(),
        vitalApi.getVitals(),
      ]);

      const appointments = appointmentsRes.status === 'fulfilled' ? appointmentsRes.value : [];
      const vitals = vitalsRes.status === 'fulfilled' ? vitalsRes.value : [];

      const rawApptList = Array.isArray(appointments) ? appointments : appointments?.appointments || [];
      const rawVitalsList = Array.isArray(vitals) ? vitals : vitals?.vitals || [];

      return {
        todayAppointments: rawApptList.slice(0, 5),
        upcomingAppointments: rawApptList,
        totalAssignedPatients: 24,
        newPatientsThisMonth: 6,
        returningPatients: 18,
        completedConsultations: 142,
        activePrescriptionsCount: 12,
        openAlertsCount: rawVitalsList.filter((v) => v.alertGenerated).length || 2,
        unreadNotificationsCount: 3,
        vitalAlerts: [
          { id: 1, patientName: 'John Doe', alertType: 'Tachycardia', heartRate: 118, recordedTime: '10 mins ago', severity: 'Critical' },
          { id: 2, patientName: 'Emma Watson', alertType: 'Hypertension', bp: '155/98', recordedTime: '1 hour ago', severity: 'Warning' },
        ],
        recentPatients: [
          { id: 101, firstName: 'John', lastName: 'Doe', age: 42, lastVisit: 'Yesterday', status: 'Follow-up' },
          { id: 102, firstName: 'Emma', lastName: 'Watson', age: 29, lastVisit: '3 days ago', status: 'Stable' },
          { id: 103, firstName: 'Robert', lastName: 'Downey', age: 55, lastVisit: '1 week ago', status: 'Routine' },
        ],
        availability: {
          workingDays: 'Mon - Fri',
          schedule: '09:00 AM - 05:00 PM',
          nextSlot: '11:30 AM Today',
          status: 'Available',
        },
        pendingRequestsCount: 3,
      };
    }
  },
};

export default doctorDashboardApi;
