export const ROUND_STATUS = [
    "pending",
    "scheduled",
    "in-progress",
    "transcribing",
    "calculating",
    "completed",
    "failed",
] as const;

export const INTERVIEW_STATUS = [
    "applied",
    "in-progress",
    "completed",
    "shortlisted",
    "rejected",
    "flagged",
    "hired",
] as const;
