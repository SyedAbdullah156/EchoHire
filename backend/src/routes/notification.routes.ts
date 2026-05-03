import express from "express";
import { protect } from "../middlewares/auth.middleware";
import { getMyNotifications, markAsRead, deleteNotification } from "../controllers/notification.controller";

const router = express.Router();

router.use(protect);

router.get("/", getMyNotifications);
router.put("/mark-read", markAsRead);
router.delete("/:id", deleteNotification);

export default router;
