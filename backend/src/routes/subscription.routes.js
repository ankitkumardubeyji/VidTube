import { Router } from 'express';
import {
    checkIfSubscribedChannel,
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/c/:channelId")
    .post(toggleSubscription);

router.route("/u/:channelId").get(getUserChannelSubscribers);
router.route("/").get(getSubscribedChannels);
router.route("/cif/:channelId").get(checkIfSubscribedChannel);

export default router
