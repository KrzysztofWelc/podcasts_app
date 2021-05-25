import axios from "axios";


const axiosInstance = axios.create({
  baseURL: process.env.BASE_URL,
  headers: {
    BrowserLang: navigator.language
  }
});


export default axiosInstance