import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    message: string;
    type: "job_alert" | "interview_scheduled" | "system";
    read: boolean;
    relatedId?: mongoose.Types.ObjectId;
    createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["job_alert", "interview_scheduled", "system"],
            default: "system",
        },
        read: {
            type: Boolean,
            default: false,
        },
        relatedId: {
            type: Schema.Types.ObjectId,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

export const Notification = mongoose.model<INotification>("Notification", notificationSchema);
