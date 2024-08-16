const express = require('express');
const router = express.Router();
const upload = require('../Middleware/Multer');
const userController = require('../Controller/user.controller');

router.post('/register', userController.Register);
router.post('/login', userController.userLogin);
router.post('/forgotpassword', userController.forgotPassword);
router.post('/verifyotp', userController.verifyOtp);
router.get('/get-all-users', userController.getAllUsers);
router.get('/get-new-users', userController.getUsersRegisteredTodayAndYesterday);
router.post('/chat', userController.sendMessage);
router.post('/addIndustry', userController.addIndustry);
router.get('/chat-history/:userId', userController.getChatHistory);
router.post('/reset', userController.resetPassword)
router.get('/profile/:userId', userController.getUserProfileById);
router.delete('/history', userController.deleteChatHistory);
router.post('/updateProfile', upload.single('profileImage'), userController.updateProfile);

module.exports = router;
