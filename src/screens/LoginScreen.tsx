import {CredentialResponse, GoogleLogin} from "@react-oauth/google";
import {AxiosError} from "axios";
import BackendError from "@/models/BackendError.ts";
import Token from "@/models/Token.ts";
import {AppContext} from "@/context/AppContext.ts";
import {useContext, useState} from "react";
import {AppScreenEnum} from "@/models/AppScreen.enum.ts";
import ApiService from "@/lib/ApiService.ts";
import ErrorMessageService from "@/lib/ErrorMessageService.ts";
import {BackendErrorCodeEnum} from "@/models/BackendErrorCode.enum.ts";
import {LoadingSpinner} from "@/components/ui/loading-spinner.tsx";
import {useTranslation} from "react-i18next";

function LoginScreen() {
  const {t} = useTranslation();
  const {navigateTo, displayToast} = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);

  async function onGoogleLoginSuccess(credentialResponse: CredentialResponse) {
    setIsLoading(true);
    ApiService.login(credentialResponse.credential!).then(response => {
      const accessToken = new Token(response.accessToken);
      accessToken.storeInCookie('accessToken');
      const refreshToken = new Token(response.refreshToken);
      refreshToken.storeInCookie('refreshToken');
      navigateTo(AppScreenEnum.Speech);
    }).catch(error => {
      const backendError = (error as AxiosError<BackendError>).response?.data;
      const errorMessage = ErrorMessageService.getErrorMessage(t, backendError);
      displayToast(errorMessage);
    }).finally(() => {
      setIsLoading(false);
    });
  }

  function onGoogleLoginError() {
    const backendError: BackendError = {
      code: BackendErrorCodeEnum.OTHER,
      message: "Google login failed."
    }
    const errorMessage = ErrorMessageService.getErrorMessage(t, backendError);
    displayToast(errorMessage)
  }

  return (
    <div className="absolute inset-0 grid place-content-center">
      {isLoading ?
        <LoadingSpinner/>
        :
        <GoogleLogin
          shape={"pill"}
          theme="filled_blue"
          use_fedcm_for_prompt={true}
          onSuccess={onGoogleLoginSuccess}
          onError={onGoogleLoginError}
        />
      }
    </div>
  );
}

export default LoginScreen;