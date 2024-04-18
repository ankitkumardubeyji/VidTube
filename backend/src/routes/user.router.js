import {Router} from "express"
import { changePassword, getCurrentUser, getUserById, getUserChannelProfile, getWatchHistory, loginUser, logOutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, updateWatchHistory } from "../controllers/user.controller.js"
const router = Router()
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

// this router acts as the middleware
router.route("/register").post(
    upload.fields([ // cant use here upload.array as the array will take in the same field multiple files.fields here expects the array
        {
            name:"avatar", // frontend field name should also be avatar.
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        },
    ]),
    registerUser)

 router.route("/login").post(loginUser)   


// secured routes
router.route("/logout").post(verifyJWT,logOutUser)
router.route("/u/:id").get(verifyJWT,getUserById)
router.route("/refreshAcessToken").post(verifyJWT,refreshAccessToken)
router.route("/change-password").post(verifyJWT,changePassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-account").patch(verifyJWT,updateAccountDetails)
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route("/cover-image").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)

router.route("/c/:username").get(verifyJWT,getUserChannelProfile);
router.route("/history").get(verifyJWT,getWatchHistory)
router.route("/uwh/:videoId").patch(verifyJWT,updateWatchHistory)



export default router

