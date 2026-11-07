import { transporter } from "../config/mailer.js";

export const sendInvitationEmail = async (email, token, role) => {
  const invitationLink =
    `${process.env.CLIENT_URL}/invitations/accept?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "You've been invited to collaborate on a diagram",
    html: `
      <h2>Diagram Invitation</h2>
      <p>You have been invited to collaborate on a diagram.</p>
      <p>Your assigned role: <strong>${role}</strong></p>
      <a href="${invitationLink}">Accept Invitation</a>
      <p>This invitation expires in 24 hours.</p>
    `
  });
};