import axios from "axios";

const URL = "https://adonis-js-mateus.herokuapp.com";

export const registerUser = async (name, email, password) => {
  const request = await axios.post(URL + "/users", {
    name,
    email,
    password,
  });

  return request.data;
};

export const login = async (email, password) => {
  const request = await axios.post(URL + "/login", {
    email,
    password,
  });

  return request.data;
};

export const logout = async (token) => {
  const request = await axios.post(
    URL + "/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return request.data;
};

export const checkLogin = async (token) => {
  const request = await axios.get(URL + "/checkLogin", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return request.data;
};

export const uploadFile = async (file, token) => {
  const formData = new FormData();
  formData.append("file", file);

  const request = await axios.post(URL + "/saveFile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  return request.data;
};

export const getFiles = async (token) => {
  const request = await axios.get(URL + "/getFiles", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return request.data;
};

export const downloadFile = async (file, token) => {
  const request = await axios.post(
    URL + "/downloadFile",
    { file: file },
    {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return request.data;
};
