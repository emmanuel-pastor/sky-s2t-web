import {jwtDecode, JwtPayload} from "jwt-decode";
import Cookies from "js-cookie";

class Token {
  constructor(private token: string) {
  }

  static fromCookie(cookieName: string): Token | undefined {
    const token = Cookies.get(cookieName);
    if (token) {
      return new Token(token);
    }

    return undefined;
  }

  get isExpired(): boolean {
    const decodedToken = jwtDecode<JwtPayload>(this.token);
    const expirationDate = decodedToken.exp;
    const currentDate = Date.now() / 1000;

    if (expirationDate) {
      // Check if the token is expired or almost expired (less than 30 seconds left)
      return currentDate >= expirationDate - 30;
    }
    return false;
  }

  get expirationDate(): Date {
    const decodedAccessToken = jwtDecode<JwtPayload>(this.token);
    return new Date(decodedAccessToken.exp! * 1000);
  }

  storeInCookie(cookieName: string) {
    Cookies.set(cookieName, this.token, {secure: true, expires: this.expirationDate});
  }
}

export default Token;