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
import { companySchema } from '../validations/job.validation';
import upload from '../utils/multer.config';

const router = express.Router();

/**
 * PUBLIC ROUTES
 * Anyone can view companies (like a job board)
 */
router.get("/", getAllCompanies);
router.get("/:id", getCompanyById);

/**
 * PROTECTED ROUTES
 * User must be logged in to manage companies
 */
router.use(protect); 

// 1. Create a company (Includes logo upload and Zod validation)
router.post(
    "/", 
    upload.single('logo'), 
    validate(companySchema), 
    createCompany
);

// 2. Update/Delete company (Only Admins or the Owner should do this)
router.patch("/:id", upload.single('logo'), updateCompany);
router.delete("/:id", restrictTo('admin'), deleteCompany);

export default router;