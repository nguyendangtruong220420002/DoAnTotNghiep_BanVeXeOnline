const express = require('express');
const router = express.Router();
const { createUser, checkPhoneNumberExists, forgotPassword,loginUser, updateUser, updateAvatarMobile, changePassword, getAllUser, getAllUserByAdmin, creatUserByAdmin ,updateUserByAdmin,deleteUserByAdmin} = require('../controllers/userController')
const authenticateToken = require('../../src/middlewares/authenticateToken');
const { upload } = require('../config/s3');

router.post('/', createUser);

router.post('/check-phone', checkPhoneNumberExists);

router.post('/login', loginUser);
router.post('/forgotPassword', forgotPassword);


router.put('/:id', authenticateToken, upload.single('img'), updateUser);
router.put("/update-avatar-mobile/:id", updateAvatarMobile);
router.post("/change-password/:id", changePassword);

router.get('/getAll', getAllUser);
router.get('/get-user-by-admin', getAllUserByAdmin);
router.post('/create-user-by-admin', creatUserByAdmin);
router.put('/edit-user-by-admin/:id', updateUserByAdmin);
router.delete('/delete-user-by-admin/:id', deleteUserByAdmin);



module.exports = router;