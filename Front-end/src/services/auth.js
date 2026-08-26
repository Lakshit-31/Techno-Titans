import api from "./api";

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);

  return response.data;
};

export const loginUser = async (userData) => {
  const response = await api.post("/auth/login", userData);

  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};

export const updateProfile = async (userData) => {
  const response = await api.put("/users/profile", userData);

  return response.data;
};

export const logoutUser = async () => {
  try {
    await api.post("/auth/logout");
  } finally {
    localStorage.removeItem("token");
  }
};
