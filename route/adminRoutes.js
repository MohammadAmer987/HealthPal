const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const { authorize } = require('../config/authMiddleware');

const adminController = new AdminController();

router.use(authorize('ROLE_ADMIN'));

router.get('/statistics', adminController.getSystemStatistics.bind(adminController));
router.get('/roles', adminController.getAllRoles.bind(adminController));
router.post('/roles', adminController.createRole.bind(adminController));
router.get('/roles/:roleId', adminController.getRoleById.bind(adminController));
router.put('/roles/:roleId', adminController.updateRole.bind(adminController));
router.get('/users', adminController.getAllUsers.bind(adminController));
router.get('/users/:userId', adminController.getUserDetails.bind(adminController));
router.post('/users/:userId/verify-email', adminController.verifyUserEmail.bind(adminController));
router.get('/health', adminController.healthCheck.bind(adminController));

module.exports = router;