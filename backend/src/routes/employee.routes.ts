import { Router } from "express";
import * as EmployeeController from "../controllers/employee.controller";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { updateEmployeeSchema } from "../validations/employee.validation";
import { objectIdSchema } from "../validations/common.validation";

const router = Router();

// All employee routes require authentication
router.use(protect);

// Admin-only management
router.get(
    "/", 
    restrictTo("admin"), 
    EmployeeController.getAllEmployees
);

router.delete(
    "/:id",
    restrictTo("admin"),
    validate(objectIdSchema),
    EmployeeController.deleteEmployeeById,
);

// Recruiter Routes
router.use(restrictTo("recruiter"));

router
    .route("/me")
    .get(EmployeeController.getMyEmployeeProfile)
    .put(
        validate(updateEmployeeSchema),
        EmployeeController.updateMyEmployeeProfile,
    )
    .delete(EmployeeController.deleteMyEmployeeProfile);

export default router;
