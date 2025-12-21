import { Router } from "express";
import {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  volunteerForCampaign,
  followCampaign,
  unfollowCampaign,
  updateCampaignProgress,
  getCampaignParticipants,
  getUserCampaigns,
} from "../controllers/campaignController";

const router = Router();

// Campaign CRUD routes
router.post("/campaigns", createCampaign);
router.get("/campaigns", getAllCampaigns);
router.get("/campaigns/:id", getCampaignById);
router.put("/campaigns/:id", updateCampaign);
router.delete("/campaigns/:id", deleteCampaign);

// Campaign participation routes
router.post("/campaigns/:id/volunteer", volunteerForCampaign);
router.post("/campaigns/:id/follow", followCampaign);
router.post("/campaigns/:id/unfollow", unfollowCampaign);

// Campaign progress and participants
router.put("/campaigns/:id/progress", updateCampaignProgress);
router.get("/campaigns/:id/participants", getCampaignParticipants);

// User campaigns
router.get("/users/:userId/campaigns", getUserCampaigns);

export default router;
