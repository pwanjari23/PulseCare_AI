const { User, Patient, Doctor, Specialization } = require('#models/index.js');
const { ApiResponse, ApiError } = require('#utils/apiResponse.js');

const mapUserResponse = (user) => {
  let firstName = 'Admin';
  let lastName = 'User';
  let doctorProfile = null;
  let patientProfile = null;

  if (user.role === 'Patient' && user.patient) {
    firstName = user.patient.firstName;
    lastName = user.patient.lastName;
    patientProfile = {
      id: user.patient.id,
      mrn: `MRN-${String(user.patient.id).padStart(5, '0')}`,
      gender: user.patient.gender,
      bloodType: user.patient.bloodType
    };
  } else if (user.role === 'Doctor' && user.doctor) {
    firstName = user.doctor.firstName;
    lastName = user.doctor.lastName;
    doctorProfile = {
      id: user.doctor.id,
      specialization: user.doctor.specialization ? user.doctor.specialization.name : 'General Practice',
      isVerified: user.doctor.isVerified
    };
  }

  return {
    id: Number(user.id),
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    lastLogin: user.lastLoginAt,
    firstName,
    lastName,
    doctorProfile,
    patientProfile
  };
};

const getUsers = async (req, res, next) => {
  try {
    const list = await User.findAll({
      include: [
        { model: Patient, as: 'patient' },
        { 
          model: Doctor, 
          as: 'doctor',
          include: [{ model: Specialization, as: 'specialization' }]
        }
      ]
    });
    const mapped = list.map(mapUserResponse);
    return res.status(200).json(
      new ApiResponse(200, mapped, 'Users retrieved successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        { model: Patient, as: 'patient' },
        { 
          model: Doctor, 
          as: 'doctor',
          include: [{ model: Specialization, as: 'specialization' }]
        }
      ]
    });
    if (!user) {
      throw new ApiError(404, 'User not found.');
    }
    return res.status(200).json(
      new ApiResponse(200, mapUserResponse(user), 'User retrieved successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      throw new ApiError(404, 'User not found.');
    }
    
    const { status, role } = req.body;
    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (role !== undefined) updateData.role = role;

    await user.update(updateData);

    // If updating doctor status, sync doctor profile verification status
    if (user.role === 'Doctor') {
      const doctor = await Doctor.findOne({ where: { id: user.id } });
      if (doctor) {
        await doctor.update({ isVerified: status === 'Active' });
      }
    }

    return res.status(200).json(
      new ApiResponse(200, { id: user.id, ...updateData }, 'User updated successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      throw new ApiError(404, 'User not found.');
    }
    
    await user.destroy();
    return res.status(200).json(
      new ApiResponse(200, { success: true }, 'User deleted successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};
