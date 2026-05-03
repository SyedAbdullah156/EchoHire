import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendAssessmentLink = async (email: string, link: string) => {
    const mailOptions = {
        from: `"EchoHire Assessments" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your Coding Assessment Link - EchoHire",
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #3b82f6;">Ready to Code?</h2>
                <p>Hello,</p>
                <p>Your application for the job has been received. Please use the link below to access your coding assessment:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${link}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Start Assessment</a>
                </div>
                <p style="font-size: 12px; color: #666;">This link is unique to you and should not be shared. It will expire soon.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 10px; color: #999; text-align: center;">&copy; 2024 EchoHire. All rights reserved.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Assessment link sent to ${email}`);
    } catch (error) {
        console.error("Error sending assessment link:", error);
        throw new Error("Failed to send email");
    }
};

export const sendAccessCode = async (email: string, code: string) => {
    const mailOptions = {
        from: `"EchoHire Security" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your EchoHire Access Code",
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #3b82f6;">Access Verification</h2>
                <p>Hello,</p>
                <p>You requested access to the coding environment. Please use the following code to verify your identity:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <span style="font-size: 32px; font-weight: black; letter-spacing: 5px; color: #1e293b; background: #f1f5f9; padding: 10px 20px; border-radius: 10px;">${code}</span>
                </div>
                <p style="font-size: 12px; color: #666;">This code will expire in 10 minutes.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 10px; color: #999; text-align: center;">&copy; 2024 EchoHire. All rights reserved.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Access code sent to ${email}`);
    } catch (error) {
        console.error("Error sending access code:", error);
        throw new Error("Failed to send email");
    }
};
