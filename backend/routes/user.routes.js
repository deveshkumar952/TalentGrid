import {Router} from 'express';
import { acceptConnectionRequest, downloadProfile, getAllUserProfiles, getMyConnectionsRequests, getUserAndProfile, login, register, sendConnectionRequest, updateProfileData, updateUserProfile, whatAreMyConnections } from '../controller/user.controller.js';
import multer from 'multer';
import { uploadProfilePicture } from '../controller/user.controller.js';

const router = Router();

const storage = multer.diskStorage({
    destination:(req,res,cb)=>{
        cb(null,'uploads');
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname);
    }
})

const upload = multer({storage});

router.route('/update_profile_picture').post(upload.single('profile_picture'),uploadProfilePicture);

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/user_update').post(updateUserProfile);
router.route('/get_user_and_profile').get(getUserAndProfile);
router.route('/update_profile_data').post(updateProfileData);
router .route('/get_all_user_profiles').get(getAllUserProfiles);
router.route('/user/download_resume').get(downloadProfile);
router.route('/user/send_connection_request').post(sendConnectionRequest);
router.route('/user/getConnectionRequests').post(getMyConnectionsRequests);
router.route('/user/user_connection_request').post(whatAreMyConnections);
router.route('/user/accept_connection_request').post(acceptConnectionRequest)


export default router;