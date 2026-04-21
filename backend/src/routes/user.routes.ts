import express from "express";
import {
    createUser,
    getUsers,
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser
} from "../controllers/user.controller";

const router = express.Router();

// Public: Sign up
router.post("/", createUser);

// Protected: Only an Admin should see all users
router.get("/", getUsers);

// User/Admin: Get specific profile
router.get("/:id", getUserById);
router.get("/email/:email", getUserByEmail);

// User/Admin: Update or Delete
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;