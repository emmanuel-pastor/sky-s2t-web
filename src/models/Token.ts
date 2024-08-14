import {jwtDecode, JwtPayload} from "jwt-decode";
import Cookies from "js-cookie";

class Token {
  private static cookiePrefix = '__Host-';

  constructor(private token: string) {
  }

  static fromCookie(cookieName: string): Token | undefined {
    const token = Cookies.get(`${Token.cookiePrefix}${cookieName}`);
    if (token) {
      return new Token(token);
    }

    return undefined;
  }

  get isExpired(): boolean {
    const expirationDate = this.expirationDate
    const currentDate = new Date();

    if (expirationDate) {
      // Check if the token is expired or almost expired (less than 30 seconds left)
      expirationDate.setSeconds(expirationDate.getSeconds() - 30);
      return currentDate >= expirationDate;
    }
    return false;
  }

  get expirationDate(): Date {
    const decodedToken = jwtDecode<JwtPayload>(this.token);
    return new Date(decodedToken.exp! * 1000);
  }

  storeInCookie(cookieName: string) {
    Cookies.set(`${Token.cookiePrefix}${cookieName}`, this.token, {
      secure: true,
      expires: this.expirationDate,
      sameSite: 'Strict'
    });
  }

  toString(): string {
    return this.token;
  }
}

export default Token;