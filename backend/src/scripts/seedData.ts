import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import bcrypt from "bcryptjs";
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

        // Clear existing data (optional, but good for a fresh seed)
        // console.log("Clearing existing jobs, companies, and interviews...");
        // await Job.deleteMany({});
        // await Company.deleteMany({});
        // await Interview.deleteMany({});

        // 1. Ensure we have users
        let candidate = await User.findOne({ role: "candidate" });
        let recruiter = await User.findOne({ role: "recruiter" });

        const salt = await bcrypt.genSalt(10);
        const defaultPassword = await bcrypt.hash("Password123!", salt);

        if (!candidate) {
            console.log("Creating dummy candidate...");
            candidate = await User.create({
                name: "John Doe",
                email: "john@example.com",
                password: defaultPassword,
                role: "candidate",
                isApproved: true
            });
        }

        if (!recruiter) {
            console.log("Creating dummy recruiter...");
            recruiter = await User.create({
                name: "Jane Smith",
                email: "jane@example.com",
                password: defaultPassword,
                role: "recruiter",
                isApproved: true
            });
        }

        // Create a secondary candidate for more diversity
        let candidate2 = await User.findOne({ email: "sarah@example.com" });
        if (!candidate2) {
            console.log("Creating second dummy candidate...");
            candidate2 = await User.create({
                name: "Sarah Connor",
                email: "sarah@example.com",
                password: defaultPassword,
                role: "candidate",
                isApproved: true
            });
        }

        console.log(`Using Candidates: ${candidate.name}, ${candidate2.name}`);
        console.log(`Using Recruiter: ${recruiter.name}`);

        // 2. Create Dummy Companies
        const companies = [
            {
                name: "MetaGravity Labs",
                description: "Deep research into agentic AI systems and autonomous simulations.",
                website: "https://metagravity.ai",
                location: "London, UK",
                logo: "https://logo.clearbit.com/openai.com",
                owner_id: recruiter._id,
                size: "50-200",
                industry: "Artificial Intelligence"
            },
            {
                name: "CyberCore Systems",
                description: "Next-gen cybersecurity and defensive AI for critical infrastructure.",
                website: "https://cybercore.io",
                location: "Berlin, DE",
                logo: "https://logo.clearbit.com/cloudflare.com",
                owner_id: recruiter._id,
                size: "201-500",
                industry: "Cybersecurity"
            },
            {
                name: "Quantum Flow",
                description: "Quantum computing solutions for real-time financial modeling and risk assessment.",
                website: "https://quantumflow.com",
                location: "New York, NY",
                logo: "https://logo.clearbit.com/ibm.com",
                owner_id: recruiter._id,
                size: "11-50",
                industry: "Quantum Computing"
            },
            {
                name: "AstroBridge Solutions",
                description: "Building the software infrastructure for interplanetary logistics.",
                website: "https://astrobridge.space",
                location: "Austin, TX",
                logo: "https://logo.clearbit.com/spacex.com",
                owner_id: recruiter._id,
                size: "501-1000",
                industry: "Aerospace"
            }
        ];

        const createdCompanies = await Company.insertMany(companies);
        console.log(`Created ${createdCompanies.length} companies.`);

        // 3. Create Dummy Jobs
        const jobs = [
            {
                name: "Engineering - Senior AI Engineer",
                role: "Senior AI Engineer",
                description: "Build the future of autonomous agents. You will be responsible for designing and implementing complex agentic workflows.",
                company_id: createdCompanies[0]._id,
                is_active: true,
                difficulty: 9,
                framework: ["Python", "PyTorch", "LangChain"],
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                location: "Hybrid - London",
                salary_range: "$150k - $220k",
                requirements: ["5+ years in ML", "Experience with LLMs", "PhD preferred"],
                rounds: [
                    { type: RoundType.TechnicalScreening, max_questions: 2 },
                    { type: RoundType.FrameworkProficiency, max_questions: 3 },
                    { type: RoundType.CodingAssessment, max_questions: 1 },
                    { type: RoundType.SystemArchitecture, max_questions: 1 }
                ]
            },
            {
                name: "Engineering - Lead Backend Architect",
                role: "Lead Backend Architect",
                description: "Scaling distributed systems to millions of users. Expertise in high-concurrency systems required.",
                company_id: createdCompanies[1]._id,
                is_active: true,
                difficulty: 8,
                framework: ["Go", "Kubernetes", "gRPC"],
                deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
                location: "Remote - Europe",
                salary_range: "€90k - €130k",
                requirements: ["Expert Go knowledge", "Cloud Native expertise", "Distributed Systems history"],
                rounds: [
                    { type: RoundType.TechnicalScreening, max_questions: 1 },
                    { type: RoundType.FrameworkProficiency, max_questions: 3 },
                    { type: RoundType.CodingAssessment, max_questions: 1 },
                    { type: RoundType.SystemArchitecture, max_questions: 1 }
                ]
            },
            {
                name: "Product - Technical Product Manager",
                role: "Technical Product Manager",
                description: "Bridging the gap between business needs and technical execution for our Quantum API.",
                company_id: createdCompanies[2]._id,
                is_active: true,
                difficulty: 7,
                framework: ["Agile", "Jira", "SQL"],
                deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
                location: "New York, NY",
                salary_range: "$130k - $170k",
                rounds: [
                    { type: RoundType.TechnicalScreening, max_questions: 1 },
                    { type: RoundType.BehavioralAnalysis, max_questions: 3 },
                    { type: RoundType.SystemArchitecture, max_questions: 1 }
                ]
            },
            {
                name: "Fullstack - Senior Frontend Developer",
                role: "Senior Frontend Developer",
                description: "Creating the most advanced dashboards for interplanetary mission control.",
                company_id: createdCompanies[3]._id,
                is_active: true,
                difficulty: 7,
                framework: ["Next.js", "Three.js", "Tailwind"],
                deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
                location: "Austin, TX / Remote",
                salary_range: "$140k - $190k",
                rounds: [
                    { type: RoundType.TechnicalScreening, max_questions: 1 },
                    { type: RoundType.FrameworkProficiency, max_questions: 4 },
                    { type: RoundType.CodingAssessment, max_questions: 1 }
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
                assessment_token: "john-token-ai",
                rounds: createdJobs[0].rounds.map(r => ({ ...r, status: "pending", qa_pairs: [] }))
            },
            {
                job_id: createdJobs[1]._id,
                user_id: candidate._id,
                status: "in-progress",
                assessment_token: "john-token-backend",
                rounds: createdJobs[1].rounds.map((r, i) => ({ 
                    ...r, 
                    status: i === 0 ? "completed" : "pending", 
                    score: i === 0 ? 85 : undefined,
                    qa_pairs: i === 0 ? [{ question: "Explain gRPC", candidate_answer: "High performance RPC framework", ai_evaluation: "Correct but brief" }] : [] 
                }))
            },
            {
                job_id: createdJobs[0]._id,
                user_id: candidate2._id,
                status: "shortlisted",
                assessment_token: "sarah-token-ai",
                score: 92,
                rounds: createdJobs[0].rounds.map(r => ({ ...r, status: "completed", score: 90 + Math.random() * 10, qa_pairs: [] }))
            },
            {
                job_id: createdJobs[3]._id,
                user_id: candidate2._id,
                status: "applied",
                assessment_token: "sarah-token-frontend",
                rounds: createdJobs[3].rounds.map(r => ({ ...r, status: "pending", qa_pairs: [] }))
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
