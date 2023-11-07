const express = require('express')
const router = express.Router()

const protect =require('../middleware/authMiddleware')
const { profileHome,
    getProfiles,
    addProfile,
    getProfile,
    updateProfile,
    deleteProfile,
    updateProfilePic,
    deleteProfilePic } = require('../controllers/profileController')
const fileUpload =require('../utils/fileUpload')


router.route('/').get(protect, profileHome);
router.route('/profiles').get(protect, getProfiles);
router.route('/profiles').post(protect, addProfile);
router.route('/profiles/:id').get(protect, getProfile);
router.route('/profiles/:id').patch(protect, updateProfile);
router.route('/profiles/:id').delete(protect, deleteProfile);
router.route('/profiles/profile-pic/:id').patch(protect,fileUpload('./storage/images'),updateProfilePic);
router.route('/profiles/profile-pic/:id').delete(protect, deleteProfilePic);


module.exports = router
