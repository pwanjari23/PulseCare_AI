const dashboardService = require('../services/dashboard.service');
const { ApiResponse } = require('#utils/apiResponse.js');

/**
 * GET /dashboard/patient — Fetch patient dashboard.
 */
const getPatientDashboard = async (req, res, next) => {
  try {
    const dto = await dashboardService.getPatientDashboard(req.user.id);
    return res.status(200).json(
      new ApiResponse(200, dto, 'Patient dashboard retrieved successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /dashboard/doctor — Fetch doctor dashboard.
 */
const getDoctorDashboard = async (req, res, next) => {
  try {
    const dto = await dashboardService.getDoctorDashboard(req.user.id);
    return res.status(200).json(
      new ApiResponse(200, dto, 'Doctor dashboard retrieved successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /dashboard/admin — Fetch admin dashboard.
 */
const getAdminDashboard = async (req, res, next) => {
  try {
    const dto = await dashboardService.getAdminDashboard();
    return res.status(200).json(
      new ApiResponse(200, dto, 'Admin dashboard retrieved successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getPatientDashboard,
  getDoctorDashboard,
  getAdminDashboard
};
