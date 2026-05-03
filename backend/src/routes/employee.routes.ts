import { Router } from "express";
import * as EmployeeController from "../controllers/employee.controller";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createEmployeeSchema, updateEmployeeSchema } from "../validations/employee.validation";

const router = Router();

// All employee routes require authentication
router.use(protect);

router
    .route("/me")
    .get(EmployeeController.getMyEmployeeProfile)
    .post(validate(createEmployeeSchema), EmployeeController.createEmployee)
    .put(validate(updateEmployeeSchema), EmployeeController.updateMyEmployeeProfile)
    .delete(EmployeeController.deleteMyEmployeeProfile);

export default router;
