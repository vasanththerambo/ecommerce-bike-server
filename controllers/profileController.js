const fs = require('fs')
const path=require('path')
const asyncHandler = require('express-async-handler')

const profileModel = require('../models/profileModel')
const {baseUrl } = require('../config/Constants');

const profileHome = asyncHandler(async (req, res) => {
    
    res.status(200).json({ message: "profile homepage" })
});

const getProfiles = asyncHandler(async (req, res) => {
    
    const profiles = await profileModel.find();
    
    // check there exist any profiles or not
    if (profiles.length != 0) {
        res.status(200).json({ data: profiles });
    }
    else
    {
        res.status(404);
        throw new Error('No Profiles Found');
    }

});

const addProfile = asyncHandler(async (req, res) => {
    
    const newProfile = req.body;
    const { email } = newProfile;


    // check whether the profile is already existing in db
    const existingProfile = await profileModel.findOne({ email });
    
    if (existingProfile) {
        res.status(409);
        throw new Error('Profile already Exist for User');
    }

    // create new profile in db
    const profile = await profileModel.create(newProfile);

    if (profile) {
        res.status(200).json({ data: profile })
    }
    else {
        res.status(400);
        throw new Error('Invalid Profile');
    }

});

const getProfile = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // access the profile with specified profile id
    const profile = await profileModel.findById(id);
    
    // check specified user profile exists or not

    if (profile) {
        res.status(200).json({ data: profile });
    }
    else {
        res.status(404);
        throw new Error('Profile Does not Exist');
    }

})

const updateProfile = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const profile = req.body;
    // update the current profile from req.body
    await profileModel.findByIdAndUpdate(id, profile);

    // access the updated profile
    const updatedProfile = await profileModel.findById(id);

    // check the updation status and return the same

    if (updatedProfile) {
        res.status(200).json({ data: updatedProfile });
    }
    else {
        res.status(404);
        throw new Error('Profile Does not Exist');
    }
    
})

const deleteProfile = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const currentProfile = await profileModel.findById(id);
    const currentProfilePic = currentProfile.profilePic;
    if (currentProfilePic) {
        const currentProfilePicName = currentProfilePic.match(/\/([^\/?#]+)[^\/]*$/);
        const currentProfilePicPath = path.resolve(__dirname, '../storage/images', currentProfilePicName[1]);
        fs.unlinkSync(currentProfilePicPath);
    }
    
    // delete the current profile 
    await profileModel.findByIdAndDelete(id);

    // check the deleted profile exists or not
    const deletedProfile = await profileModel.findById(id);

    if (!deletedProfile) {
        res.status(202).json({_id:id});
    }
    else {
        res.status(400);
        throw new Error('Delete Failed');
    }

})

const updateProfilePic = asyncHandler(async (req, res) => {
    
    const { id } = req.params;
    const profile = {};
    var imgUrl = '';
    if (req.file) {
        imgUrl = `${baseUrl}/storage/images/${req.file.filename}`;

    }

    profile.profilePic = imgUrl;

    const currentProfile = await profileModel.findById(id);
    const currentProfilePic = currentProfile.profilePic;
    if (currentProfilePic) {
        const currentProfilePicName = currentProfilePic.match(/\/([^\/?#]+)[^\/]*$/);
        const currentProfilePicPath = path.resolve(__dirname, '../storage/images', currentProfilePicName[1]);
        fs.unlinkSync(currentProfilePicPath);
    }

    await profileModel.findByIdAndUpdate(id, profile);
    const updatedProfile = await profileModel.findById(id);

    if (updatedProfile) {
        res.status(200).json({ data: updatedProfile });
    }
    else {
        res.status(404);
        throw new Error('Profile Does not Exist');
    }
    
})

const deleteProfilePic = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const currentProfile = await profileModel.findById(id);
    const currentProfilePic = currentProfile.profilePic;
    if (currentProfilePic) {
        const currentProfilePicName = currentProfilePic.match(/\/([^\/?#]+)[^\/]*$/);
        const currentProfilePicPath = path.resolve(__dirname, '../storage/images', currentProfilePicName[1]);
        fs.unlinkSync(currentProfilePicPath);
    }

    currentProfile.profilePic = null;

    await profileModel.findByIdAndUpdate(id, currentProfile);
    
    const picDeletedProfile = await profileModel.findById(id);

    if (!picDeletedProfile.profilePic) {
        res.status(200).json({ data:picDeletedProfile});
    }
    else {
        res.status(400);
        throw new Error("Delete profile pic failed");
    }

    

})

module.exports = {
    profileHome,
    addProfile,
    getProfiles,
    getProfile,
    updateProfile,
    deleteProfile,
    updateProfilePic,
    deleteProfilePic
}

