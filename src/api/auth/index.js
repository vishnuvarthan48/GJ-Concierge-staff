import axiosServices from "../index";

const API_ENDPOINT_LOGIN = "oauth/token";

const api = {
  login: async ({ username, password }) => {
    const formData = new FormData();
    formData.append("grant_type", "password");
    formData.append("username", username);
    formData.append("password", password);
    const clientId = import.meta.env.VITE_OAUTH_CLIENT_ID || "api";
    const clientSecret = import.meta.env.VITE_OAUTH_CLIENT_SECRET || "DJConnectapi!!";
    const basicAuth = btoa(`${clientId}:${clientSecret}`);

    const response = await axiosServices.post(API_ENDPOINT_LOGIN, formData, {
      headers: {
        Authorization: `Basic ${basicAuth}`,
      },
    });

    return response;
  },
};

export { api };
