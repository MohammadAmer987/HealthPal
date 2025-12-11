const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { requireAuth, authorize } = require('../config/authMiddleware');

const userController = new UserController();

router.use(requireAuth);

router.get('/me', userController.getCurrentUser.bind(userController));
router.get('/:userId', userController.getUserById.bind(userController));
router.get('/username/:username', userController.getUserByUsername.bind(userController));
router.put('/:userId', userController.updateUserProfile.bind(userController));
router.post('/:userId/change-password', userController.changePassword.bind(userController));

router.get('/active', authorize('ROLE_ADMIN'), userController.getAllActiveUsers.bind(userController));
router.get('/admins', authorize('ROLE_ADMIN'), userController.getAllAdmins.bind(userController));
router.get('/role/:roleName', authorize('ROLE_ADMIN'), userController.getUsersByRole.bind(userController));
router.post('/:userId/assign-role', authorize('ROLE_ADMIN'), userController.assignRoleToUser.bind(userController));
router.post('/:userId/activate', authorize('ROLE_ADMIN'), userController.activateUser.bind(userController));
router.post('/:userId/deactivate', authorize('ROLE_ADMIN'), userController.deactivateUser.bind(userController));
router.delete('/:userId', authorize('ROLE_ADMIN'), userController.deleteUser.bind(userController));

module.exports = router;