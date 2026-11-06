import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import { createInvitationSchema } from "../validators/diagramValidator.js";
import { createInvitationController } from "../controllers/invitationController.js";

const router = express.Router();

router.post(
  "/:id/invitations",
  authenticateUser,
  validate(createInvitationSchema),
  createInvitationController
);

export default router;