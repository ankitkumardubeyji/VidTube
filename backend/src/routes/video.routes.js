import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getUserVideos,
    getVideoById,
    publishAVideo,
    searchVideo,
    togglePublishStatus,
    updateVideo,
    updateVideosCount,
} from "../controllers/video.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/")
    .get(getAllVideos)
    .post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
            
        ]),
        publishAVideo
    );

router
    .route("/:videoId")
    .get(getVideoById)
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);
router.route("/uvc/:videoId").patch(updateVideosCount)
router.route("/u/:userId").get(getUserVideos)
router.route("/search/vidtube").get(searchVideo)

export default router