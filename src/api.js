import axios from "axios";

export const api = axios.create({
  baseURL: 'https://api.yeatwork.ru/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})