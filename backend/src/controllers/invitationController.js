import asyncHandler from "../utils/asyncHandler.js";
import { createInvitation } from "../services/invitationService.js";
import ApiError from "../utils/ApiError.js";
import { sendInvitationEmail } from "../utils/sendInvitationEmail.js";

export const createInvitationController = asyncHandler(
  async (req, res) => {
    try {
      const invitation = await createInvitation(
        req.params.id,
        req.user.id,
        req.body.email,
        req.body.role
      );

      return res.status(201).json({
        success: true,
        message: "Invitation created successfully",
        data: invitation
      });
    } catch (error) {
      if (error.message === "DIAGRAM_NOT_FOUND") {
        throw new ApiError(404, "Diagram not found");
      }

      if (error.message === "FORBIDDEN") {
        throw new ApiError(403, "Only the owner can invite collaborators");
      }

      if (error.message === "CANNOT_INVITE_OWNER") {
        throw new ApiError(400, "You cannot invite yourself");
      }

      throw error;
    }
  }
);