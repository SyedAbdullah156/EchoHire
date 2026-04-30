import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { Job } from "../models/job.model";
import { Interview } from "../models/interview.model";
import { Company } from "../models/company.model";
import { RoundType } from "../constants/roundtypes.constants";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/echohire";

const resetJobs = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB for job reset...");

        // 1. Delete all Interviews and Jobs
        console.log("Deleting all active interviews...");
        await Interview.deleteMany({});
        console.log("Deleting all existing jobs...");
        await Job.deleteMany({});

        // 2. Get existing companies to link
        const companies = await Company.find({});
        if (companies.length === 0) {
            console.error("No companies found. Please run seedData.ts first to create companies.");
            process.exit(1);
        }

        const standardRounds = [
            { type: RoundType.BehavioralAnalysis, max_questions: 5 },
            { type: RoundType.TechnicalScreening, max_questions: 5 },
            { type: RoundType.CodingAssessment, max_questions: 3 }
        ];

        const newJobs = [
            {
                name: "Engineering - Senior AI Engineer",
                role: "Senior AI Engineer",
                description: "Build the future of autonomous agents. You will be responsible for designing and implementing complex agentic workflows.",
                company_id: companies[0]._id,
                is_active: true,
                difficulty: 9,
                framework: ["Python", "PyTorch", "LangChain"],
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                location: "Hybrid - London",
                salary_range: "$150k - $220k",
                requirements: ["5+ years in ML", "Experience with LLMs", "Expertise in vector databases"],
                rounds: standardRounds
            },
            {
                name: "Engineering - Lead Backend Architect",
                role: "Lead Backend Architect",
                description: "Scaling distributed systems to millions of users. Expertise in high-concurrency systems required.",
                company_id: companies[1 % companies.length]._id,
                is_active: true,
                difficulty: 8,
                framework: ["Go", "Kubernetes", "gRPC"],
                deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
                location: "Remote - Europe",
                salary_range: "€90k - €130k",
                requirements: ["Expert Go knowledge", "Cloud Native expertise", "Distributed Systems history"],
                rounds: standardRounds
            },
            {
                name: "Fullstack - Senior Frontend Developer",
                role: "Senior Frontend Developer",
                description: "Creating the most advanced dashboards for interplanetary mission control.",
                company_id: companies[3 % companies.length]._id,
                is_active: true,
                difficulty: 7,
                framework: ["Next.js", "Three.js", "Tailwind"],
                deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
                location: "Austin, TX / Remote",
                salary_range: "$140k - $190k",
                rounds: standardRounds
            },
            {
                name: "Engineering - BCI Software Engineer",
                role: "BCI Software Engineer",
                description: "Develop low-latency signal processing algorithms for brain-computer interfaces.",
                company_id: companies[4 % companies.length]._id,
                is_active: true,
                difficulty: 10,
                framework: ["C++", "Rust", "CUDA"],
                deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
                location: "San Francisco, CA",
                salary_range: "$180k - $250k",
                requirements: ["Expert C++/Rust", "Signal processing background", "Real-time systems experience"],
                rounds: standardRounds
            }
        ];

        const createdJobs = await Job.insertMany(newJobs);
        console.log(`Successfully created ${createdJobs.length} new jobs with the new 2-round + Coding flow.`);

        console.log("Reset completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Reset failed:", error);
        process.exit(1);
    }
};

resetJobs();
