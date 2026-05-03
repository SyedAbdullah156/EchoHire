import { Router } from "express";
import { 
    executeCode, 
    validateToken, 
    requestAccessCode, 
    verifyAccessCode 
} from "../controllers/coding.controller";
import { protect } from "../middlewares/auth.middleware";


const router = Router();

router.post("/execute", protect, executeCode);

// Challenge Gate Endpoints
router.get("/validate-token", validateToken); // Publicly accessible with token
router.post("/request-access-code", protect, requestAccessCode);
router.post("/verify-access-code", protect, verifyAccessCode);

export default router;
