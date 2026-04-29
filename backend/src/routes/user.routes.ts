import express from "express";
import {
    createUser,
    getAllUsers,
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser
} from "../controllers/user.controller";

const router = express.Router();

// Public: Sign up
router.post("/", createUser);

// Protected: Only an Admin should see all users
router.get("/", getAllUsers);

// User/Admin: Get specific profile
router.get("/email/:email", getUserByEmail);
router.get("/:id", getUserById);

// User/Admin: Update or Delete
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;