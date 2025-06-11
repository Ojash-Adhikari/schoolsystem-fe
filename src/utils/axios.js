import baseAxios from "axios";

export const BASE_URL = "http://127.0.0.1:8000";

const axios = baseAxios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axios
