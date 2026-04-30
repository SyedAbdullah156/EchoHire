import { Router } from "express";
import { 
    executeCode, 
    validateToken, 
    validateJoinCode,
    requestAccessCode, 
    verifyAccessCode 
} from "../controllers/coding.controller";
import { protect } from "../middlewares/auth.middleware";


const router = Router();

router.post("/execute", protect, executeCode);

// Challenge Gate Endpoints
router.get("/validate-token", validateToken);
router.get("/validate-join-code", protect, validateJoinCode);
router.post("/request-access-code", protect, requestAccessCode);
router.post("/verify-access-code", protect, verifyAccessCode);

export default router;
