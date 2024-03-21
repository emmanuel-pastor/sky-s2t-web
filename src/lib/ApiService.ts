import axios from "axios";
import TokenResponse from "@/models/TokenResponse.ts";
import Token from "@/models/Token.ts";

const baseUrl = 'http://localhost:7071/api';
const client = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json'
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

  static async refreshToken(refreshToken: Token): Promise<TokenResponse> {
    const response = await client.post<TokenResponse>(ApiRoutes.REFRESH_TOKEN, {}, {
      headers: {
        'Authorization': `Bearer ${refreshToken.toString()}`
      }
    });

    return response.data;
  }
}