
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const API = {
  LOGIN: `${API_BASE_URL}${process.env.NEXT_PUBLIC_LOGIN_API}`,
  REGISTER: `${API_BASE_URL}${process.env.NEXT_PUBLIC_REGISTER_API}`,
  FORGOT_PASSWORD: `${API_BASE_URL}${process.env.NEXT_PUBLIC_FORGOT_PASSWORD_API}`,
  RESET_PASSWORD: `${API_BASE_URL}${process.env.NEXT_PUBLIC_RESET_PASSWORD_API}`,

  // Diagrams
  DIAGRAMS: `${API_BASE_URL}/diagrams`,
  CREATE_DIAGRAM: `${API_BASE_URL}/diagrams`,

  GET_DIAGRAM: (diagramId) =>
    `${API_BASE_URL}/diagrams/${encodeURIComponent(diagramId)}`,

  UPDATE_DIAGRAM: (diagramId) =>
    `${API_BASE_URL}/diagrams/${encodeURIComponent(diagramId)}`,

  DELETE_DIAGRAM: (diagramId) =>
    `${API_BASE_URL}/diagrams/${encodeURIComponent(diagramId)}`,

  DUPLICATE_DIAGRAM: (diagramId) =>
    `${API_BASE_URL}/diagrams/${encodeURIComponent(diagramId)}/duplicate`,
};
