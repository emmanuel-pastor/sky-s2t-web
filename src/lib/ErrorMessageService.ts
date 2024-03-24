import BackendError from "@/models/BackendError.ts";
import {BackendErrorCodeEnum} from "@/models/BackendErrorCode.enum.ts";

export default class ErrorMessageService {
  public static getErrorMessage(error: BackendError | undefined): string {
    let message = 'Something went wrong. Please try again later.';

    if (!error) {
      return message;
    }
    if (import.meta.env.MODE === 'development') {
      console.error("[SKY S2T]:", error);
    }

    switch (error.code) {
      case BackendErrorCodeEnum.INVALID_HOSTED_DOMAIN:
        message = 'Please log in with your Skyincap account'
        break;
      case BackendErrorCodeEnum.USER_ACCESS_REVOKED:
        message = 'Your access has been revoked. Please contact your administrator.'
        break;
    }
    return message;
  }
}