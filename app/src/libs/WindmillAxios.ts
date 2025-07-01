import axios from "axios";
const WindmillAxios = axios.create({});

WindmillAxios.defaults.headers.common["botid"] = process.env.BOT_ID as string;
WindmillAxios.defaults.baseURL = `http://localhost:${process.env.PORT}`;

WindmillAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject({
      err: error.response.data,
      msg: error.message,
      code: error.response.status,
    });
  }
);

export default WindmillAxios;
