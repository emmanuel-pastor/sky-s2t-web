import axios from "axios";
import TokenResponse from "@/models/TokenResponse.ts";

const baseUrl = import.meta.env.VITE_BASE_URL;
const client = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json'
  },
  params: {
    'code': import.meta.env.VITE_API_KEY
  }
});

enum ApiRoutes {
  LOGIN = '/login',
  REFRESH_TOKEN = '/refreshToken',
}

export default class ApiService {
  static async login(idToken: string): Promise<TokenResponse> {
    const response = await client.post<TokenResponse>(ApiRoutes.LOGIN, {}, {
      headers: {
        'Authorization': `Bearer ${idToken}`
      }
    });

    return response.data;
  }

  static async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const response = await client.post<TokenResponse>(ApiRoutes.REFRESH_TOKEN, {}, {
      headers: {
        'Authorization': `Bearer ${refreshToken}`
      }
    });

    return response.data;
  }
}