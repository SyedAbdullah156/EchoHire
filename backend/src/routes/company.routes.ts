import express from 'express';
import { 
    createCompany, 
    getAllCompanies, 
    getCompanyById, 
    updateCompany, 
    deleteCompany 
} from '../controllers/company.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createCompanySchema, companyParamsSchema, updateCompanySchema } from '../validations/comapny.validation';
import upload from '../utils/multer.config';

const router = express.Router();

/**
 * PUBLIC ROUTES
 * Anyone can view companies (like a job board)
 */
router.get("/", getAllCompanies);
router.get("/:id", validate(companyParamsSchema), getCompanyById);

/**
 * PROTECTED ROUTES
 * User must be logged in to manage companies
 */
router.use(protect); 

// 1. Create a company (Includes logo upload and Zod validation)
router.post(
    "/", 
    upload.single('logo'), 
    validate(createCompanySchema), 
    createCompany
);

// 2. Update/Delete company (Only Admins or the Owner should do this)
router.patch("/:id", upload.single('logo'), validate(updateCompanySchema), updateCompany);
router.delete("/:id", validate(companyParamsSchema), restrictTo('admin'), deleteCompany);

export default router;