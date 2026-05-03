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
                name: "TechNova Solutions",
                description: "Leading AI and Cloud computing firm.",
                website: "https://technova.io",
                location: "San Francisco, CA",
                logo_url: "https://logo.clearbit.com/google.com",
                owner_id: recruiter._id
            },
            {
                name: "GreenStep Eco",
                description: "Sustainable energy and green technology.",
                website: "https://greenstep.eco",
                location: "Austin, TX",
                logo_url: "https://logo.clearbit.com/tesla.com",
                owner_id: recruiter._id
            }
        ];

        const createdCompanies = await Company.insertMany(companies);
        console.log(`Created ${createdCompanies.length} companies.`);

        // 3. Create Dummy Jobs
        const jobs = [
            {
                name: "Senior React Developer Role",
                role: "Senior Frontend Engineer",
                description: "Looking for a React expert to lead our dashboard team.",
                company_id: createdCompanies[0]._id,
                created_by: recruiter._id,
                is_active: true,
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                rounds: [
                    { type: RoundType.TechnicalScreening, max_questions: 5 },
                    { type: RoundType.BehavioralAnalysis, max_questions: 3 }
                ]
            },
            {
                name: "Fullstack Node.js Developer Position",
                role: "Fullstack Developer (Node.js)",
                description: "Build scalable APIs and beautiful UIs.",
                company_id: createdCompanies[1]._id,
                created_by: recruiter._id,
                is_active: true,
                deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
                rounds: [
                    { type: RoundType.TechnicalScreening, max_questions: 6 }
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
                status: "in-progress",
                rounds: [
                    {
                        type: RoundType.TechnicalScreening,
                        max_questions: 5,
                        status: "completed",
                        score: 85,
                        remarks: "Great understanding of React and Framer Motion.",
                        qa_pairs: [
                            {
                                question: "How do you handle state in React?",
                                candidate_answer: "Using hooks and context API.",
                                ai_evaluation: "Correct but could be more detailed.",
                                timestamp: new Date()
                            }
                        ]
                    },
                    {
                        type: RoundType.BehavioralAnalysis,
                        max_questions: 3,
                        status: "pending",
                        qa_pairs: []
                    }
                ],
                score: 85,
                remarks: "Strong technical start."
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
