import  asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import {
    createDiagram,
    getUserDiagrams,
    getDiagramById,
    updateDiagram,
    deleteDiagram
} from "../services/diagramService.js";

export const createDiagramController = asyncHandler(async (req, res) => {
    const diagram = await createDiagram(req.user.id, req.body);

    return res.status(201).json({
        success: true,
        message: "Diagram created successfully",
        data: diagram
    });
});
export const getUserDiagramsController = asyncHandler(async (req, res) => {
    const diagrams = await getUserDiagrams(req.user.id);

    return res.status(200).json({
        success: true,
        data: diagrams
    });
});

export const getDiagramByIdController = asyncHandler(async (req, res) => {
    try {
        const diagram = await getDiagramById(
            req.params.id,
            req.user.id
        );

        return res.status(200).json({
            success: true,
            data: diagram
        });
    } catch (error) {
        if (error.message === "DIAGRAM_NOT_FOUND") {
            throw new ApiError(404, "Diagram not found");
        }

        if (error.message === "FORBIDDEN") {
            throw new ApiError(403, "You do not have access to this diagram");
        }

        throw error;
    }
});
export const updateDiagramController = asyncHandler(async (req, res) => {
  try {
    const diagram = await updateDiagram(
      req.params.id,
      req.user.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Diagram updated successfully",
      data: diagram
    });
  } catch (error) {
    if (error.message === "DIAGRAM_NOT_FOUND") {
      throw new ApiError(404, "Diagram not found");
    }

    if (error.message === "FORBIDDEN") {
      throw new ApiError(403, "You do not have permission to edit this diagram");
    }

    throw error;
  }
});
export const deleteDiagramController = asyncHandler(async (req, res) => {
  try {
    await deleteDiagram(req.params.id, req.user.id);

    return res.status(200).json({
      success: true,
      message: "Diagram deleted successfully"
    });
  } catch (error) {
    if (error.message === "DIAGRAM_NOT_FOUND") {
      throw new ApiError(404, "Diagram not found");
    }

    if (error.message === "FORBIDDEN") {
      throw new ApiError(403, "Only the owner can delete this diagram");
    }

    throw error;
  }
});
export const duplicateDiagramController = asyncHandler(async (req, res) => {
  try {
    const diagram = await duplicateDiagram(req.params.id, req.user.id);

    return res.status(201).json({
      success: true,
      message: "Diagram duplicated successfully",
      data: diagram
    });
  } catch (error) {
    if (error.message === "DIAGRAM_NOT_FOUND") {
      throw new ApiError(404, "Diagram not found");
    }

    if (error.message === "FORBIDDEN") {
      throw new ApiError(403, "You do not have access to this diagram");
    }

    throw error;
  }
});