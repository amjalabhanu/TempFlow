import { Router } from "express";

import {
  createDiagramController,
  getUserDiagramsController,
  getDiagramByIdController,
  updateDiagramController,
  deleteDiagramController,
  duplicateDiagramController
} from "../controllers/diagramController.js";

import { createDiagramSchema, updateDiagramSchema } from "../validators/diagramValidator.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = Router();

router.post(
  "/",
  authenticateUser,
  validate(createDiagramSchema),
  createDiagramController
);

router.get("/", authenticateUser, getUserDiagramsController);
router.get("/:id", authenticateUser, getDiagramByIdController);
router.patch(
  "/:id",
  authenticateUser,
  validate(updateDiagramSchema),
  updateDiagramController
);
router.delete("/:id", authenticateUser, deleteDiagramController);
router.post("/:id/duplicate", authenticateUser, duplicateDiagramController);

export default router;