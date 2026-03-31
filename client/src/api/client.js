import axios from "axios";

const client = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

export const setToken = (token) => {
  if (token) {
    client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

export default client;