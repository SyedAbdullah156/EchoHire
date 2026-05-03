export interface TUser {
    _id?: string;
    name: string;
    email: string;
    password?: string;
    role: "candidate" | "recruiter" | "admin";
    googleId?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
}
