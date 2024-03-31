import BackendError from "@/models/BackendError.ts";
import {BackendErrorCodeEnum} from "@/models/BackendErrorCode.enum.ts";
import {TFunction} from "i18next";

export default class ErrorMessageService {
  public static getErrorMessage(t: TFunction<"translation", undefined>, error: BackendError | undefined): string {
    let message = t("backendError.default");

    if (!error) {
      return message;
    }
    if (import.meta.env.MODE === 'development') {
      console.error("[SKY S2T]:", error);
    }

    switch (error.code) {
      case BackendErrorCodeEnum.INVALID_HOSTED_DOMAIN:
        message = t("backendError.invalidHostedDomain")
        break;
      case BackendErrorCodeEnum.USER_ACCESS_REVOKED:
        message = t("backendError.userAccessRevoked")
        break;
    }
    return message;
  }
}