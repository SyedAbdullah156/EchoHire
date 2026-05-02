export interface TProfile {
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
    // Recruiter Specific
    jobTitle?: string;
    companyId?: string;
    companyName?: string;
    companyWebsite?: string;
    companySize?: string;
    industry?: string;
    recruitingFocus?: string;
    bio?: string;
    notifications?: {
        email?: boolean;
        desktop?: boolean;
        marketing?: boolean;
    };
}

export interface TUser {
    _id?: string;
    name: string;
    email: string;
    password?: string;
    role: "candidate" | "recruiter" | "admin";
    profile?: TProfile;
    googleId?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
}
