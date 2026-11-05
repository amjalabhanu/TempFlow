import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

export const sendPasswordResetEmail = async (email, resetLink) => {
    await transporter.sendMail({
        from: `"TempFlow" <${process.env.MAIL_USER}>`,
        to: email,
        subject: "TempFlow – Password Reset",
        html: `
            <h2>Password Reset Request</h2>
            <p>You requested to reset your TempFlow password.</p>
            <p>Click the link below to reset it:</p>
            <a href="${resetLink}">Reset Password</a>
            <p>This link expires in 15 minutes.</p>
            <p>If you didn't request this, ignore this email.</p>
        `
    });
};