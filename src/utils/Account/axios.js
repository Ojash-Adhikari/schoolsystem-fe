import baseAxios from "axios";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

export const BASE_URL = "http://127.0.0.1:8000";
const authToken = localStorage.getItem("_auth");

const axios = baseAxios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${authToken}`,
  },
});

export default axios
