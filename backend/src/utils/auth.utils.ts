import jwt from "jsonwebtoken";

type AuthPayload = {
    id?: unknown;
    _id?: unknown;
    email: string;
    role: string;
    name: string;
};

const JWT_SECRET = process.env.JWT_SECRET ?? "echohire-dev-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";

export const signAuthToken = (user: AuthPayload) => {
    const userId = user.id ?? user._id;

    if (!userId) {
        throw new Error("Cannot sign auth token without a user id");
    }

    return jwt.sign(
        {
            id: String(userId),
            email: user.email,
            role: user.role,
            name: user.name,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN as any },
    );
};

export const verifyAuthToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET) as AuthPayload & { iat: number; exp: number };
};