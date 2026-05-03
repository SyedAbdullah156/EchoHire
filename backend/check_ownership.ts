import mongoose from "mongoose";
import { Interview } from "./src/models/interview.model";
import "./src/config/env.config";

async function check() {
    await mongoose.connect(process.env.MONGODB_URI!);
    const userId = "69f5d076b9ba6d425dbdc2d3";
    const interviewId = "69f61f767117bbea3edc42c0";

    const interview = await Interview.findById(interviewId);
    if (!interview) {
        console.log("Interview not found!");
    } else {
        console.log("Interview Owner ID:", interview.user_id.toString());
        console.log("Your User ID:", userId);
        console.log("Match?", interview.user_id.toString() === userId);
    }

    const myInterviews = await Interview.find({ user_id: userId });
    console.log("\nInterviews owned by you:");
    myInterviews.forEach(i => console.log("- ID:", i._id, "| Status:", i.status));

    await mongoose.disconnect();
}

check();
