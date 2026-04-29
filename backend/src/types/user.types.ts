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
}

export interface TUser{
    _id?: string;
    name: string;
    email: string;
    password?: string;
    role: 'candidate' | 'recruiter' | 'admin';
    profile?: TProfile;
}