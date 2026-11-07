import crypto from "crypto";
import prisma from "../config/database.js";

export const createInvitation = async (
  diagramId,
  senderId,
  email,
  role
) => {
  const diagram = await prisma.diagram.findUnique({
    where: { id: diagramId }
  });

  if (!diagram) throw new Error("DIAGRAM_NOT_FOUND");

  if (diagram.ownerId !== senderId) {
    throw new Error("FORBIDDEN");
  }

  if (!email || email.trim().length === 0) {
    throw new Error("INVALID_EMAIL");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const recipient = await prisma.user.findUnique({
    where: { email: normalizedEmail }
  });

  if (!recipient) {
    throw new Error("USER_NOT_REGISTERED");
  }

  if (recipient.id === senderId) {
    throw new Error("CANNOT_INVITE_OWNER");
  }

  // Immediately grant collaborator access
  await prisma.diagramCollaborator.upsert({
    where: {
      diagramId_userId: {
        diagramId,
        userId: recipient.id
      }
    },
    update: { role },
    create: {
      diagramId,
      userId: recipient.id,
      role
    }
  });

  // Keep invitation record for tracking
  const token = crypto.randomBytes(32).toString("hex");

  return prisma.diagramInvitation.create({
    data: {
      diagramId,
      senderId,
      email: normalizedEmail,
      recipientId: recipient.id,
      role,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
  });
};