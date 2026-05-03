import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { User } from "../models/user.model";
import { Job } from "../models/job.model";
import { Company } from "../models/company.model";
import { Interview } from "../models/interview.model";
import { RoundType } from "../constants/roundtypes.constants";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/echohire";

const seedData = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB for seeding...");

        // 1. Find a Candidate and a Recruiter
        const candidate = await User.findOne({ role: "candidate" });
        const recruiter = await User.findOne({ role: "recruiter" });

        if (!candidate || !recruiter) {
            console.error("Please create at least one candidate and one recruiter user first.");
            process.exit(1);
        }

        console.log(`Using Candidate: ${candidate.name} (${candidate._id})`);
        console.log(`Using Recruiter: ${recruiter.name} (${recruiter._id})`);

        // 2. Create Dummy Companies
        const companies = [
            {
                name: "MetaGravity Labs",
                description: "Deep research into agentic AI systems.",
                website: "https://metagravity.ai",
                location: "London, UK",
                logo_url: "https://logo.clearbit.com/openai.com",
                owner_id: recruiter._id
            },
            {
                name: "CyberCore Systems",
                description: "Next-gen cybersecurity and defensive AI.",
                website: "https://cybercore.io",
                location: "Berlin, DE",
                logo_url: "https://logo.clearbit.com/cloudflare.com",
                owner_id: recruiter._id
            },
            {
                name: "Quantum Flow",
                description: "Quantum computing for financial modeling.",
                website: "https://quantumflow.com",
                location: "New York, NY",
                logo_url: "https://logo.clearbit.com/ibm.com",
                owner_id: recruiter._id
            }
        ];

        const createdCompanies = await Company.insertMany(companies);
        console.log(`Created ${createdCompanies.length} companies.`);

        // 3. Create Dummy Jobs with Turing Rounds
        const jobs = [
            {
                name: "Engineering - Senior AI Engineer",
                role: "Senior AI Engineer",
                description: "Build the future of autonomous agents.",
                company_id: createdCompanies[0]._id,
                created_by: recruiter._id,
                is_active: true,
                difficulty: 9,
                framework: ["Python", "PyTorch", "LangChain"],
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                rounds: [
                    { type: RoundType.TechnicalScreening, max_questions: 1 },
                    { type: RoundType.FrameworkProficiency, max_questions: 3 },
                    { type: RoundType.CodingAssessment, max_questions: 1 },
                    { type: RoundType.SystemArchitecture, max_questions: 1 }
                ]
            },
            {
                name: "Engineering - Lead Backend Architect",
                role: "Lead Backend Architect",
                description: "Scaling distributed systems to millions of users.",
                company_id: createdCompanies[1]._id,
                created_by: recruiter._id,
                is_active: true,
                difficulty: 8,
                framework: ["Go", "Kubernetes", "gRPC"],
                deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
                rounds: [
                    { type: RoundType.TechnicalScreening, max_questions: 1 },
                    { type: RoundType.FrameworkProficiency, max_questions: 3 },
                    { type: RoundType.CodingAssessment, max_questions: 1 },
                    { type: RoundType.SystemArchitecture, max_questions: 1 }
                ]
            }
        ];

        const createdJobs = await Job.insertMany(jobs);
        console.log(`Created ${createdJobs.length} jobs.`);

        // 4. Create Dummy Interviews
        const interviews = [
            {
                job_id: createdJobs[0]._id,
                user_id: candidate._id,
                status: "applied",
                assessment_token: "test-token-123",
                rounds: createdJobs[0].rounds.map(r => ({ ...r, status: "pending", qa_pairs: [] }))
            }
        ];

        const createdInterviews = await Interview.insertMany(interviews);
        console.log(`Created ${createdInterviews.length} interviews.`);

        console.log("Seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedData();
