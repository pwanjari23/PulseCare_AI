const { User } = require('#models/index.js');
const { ApiResponse } = require('#utils/apiResponse.js');

const getAdmins = async (req, res, next) => {
  try {
    const list = await User.findAll({
      where: { role: 'Admin' }
    });
    
    const mapped = list.map(user => ({
      id: Number(user.id),
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      lastLogin: user.lastLoginAt,
      firstName: 'Admin',
      lastName: 'User'
    }));

    return res.status(200).json(
      new ApiResponse(200, mapped, 'Admins retrieved successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAdmins
};
