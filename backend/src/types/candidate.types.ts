import { TUser } from "./user.types";

export interface TCandidateProfile {
    phone?: string;
    cityCountry?: string;
    linkedInUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    targetRole?: string;
    yearsExperience?: string;
    currentStatus?: string;
    degree?: string;
    university?: string;
    graduationYear?: string;
    cgpa?: string;
    coreSkills?: string;
    preferredIndustry?: string;
    interviewFocus?: string;
    careerGoal?: string;
    avatarDataUrl?: string;
}

export interface TCandidate extends TUser {
    profile?: TCandidateProfile;
}
