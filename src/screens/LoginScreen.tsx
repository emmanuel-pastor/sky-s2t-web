import {CredentialResponse, GoogleLogin} from "@react-oauth/google";
import {AxiosError} from "axios";
import BackendError from "@/models/BackendError.ts";
import Token from "@/models/Token.ts";
import {AppContext} from "@/context/AppContext.ts";
import {useContext} from "react";
import {AppScreenEnum} from "@/models/AppScreen.enum.ts";
import ApiService from "@/lib/ApiService.ts";
import ErrorMessageService from "@/lib/ErrorMessageService.ts";
import {BackendErrorCodeEnum} from "@/models/BackendErrorCode.enum.ts";

function LoginScreen() {
  const {navigateTo, displayToast} = useContext(AppContext);

  async function onGoogleLoginSuccess(credentialResponse: CredentialResponse) {
    ApiService.login(credentialResponse.credential!).then(response => {
      const accessToken = new Token(response.accessToken);
      accessToken.storeInCookie('accessToken');
      const refreshToken = new Token(response.refreshToken);
      refreshToken.storeInCookie('refreshToken');
      navigateTo(AppScreenEnum.Speech);
    }).catch(error => {
      const backendError = (error as AxiosError<BackendError>).response?.data;
      const errorMessage = ErrorMessageService.getErrorMessage(backendError);
      displayToast(errorMessage);
    });
  }

  function onGoogleLoginError() {
    const backendError: BackendError = {
      code: BackendErrorCodeEnum.OTHER,
      message: "Google login failed."
    }
    const errorMessage = ErrorMessageService.getErrorMessage(backendError);
    displayToast(errorMessage)
  }

  return (
    <>
      <GoogleLogin
        shape={"pill"}
        theme="filled_blue"
        use_fedcm_for_prompt={true}
        onSuccess={onGoogleLoginSuccess}
        onError={onGoogleLoginError}
      />
    </>
  );
}

export default LoginScreen;