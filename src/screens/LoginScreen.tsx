import {CredentialResponse, GoogleLogin} from "@react-oauth/google";
import axios, {AxiosError} from "axios";
import BackendError from "@/models/BackendError.ts";
import Token from "@/models/Token.ts";
import {AppContext} from "@/context/AppContext.ts";
import {useContext} from "react";
import {AppScreenEnum} from "@/models/AppScreen.enum.ts";
import ApiService from "@/lib/ApiService.ts";

function LoginScreen() {
  const {navigateTo} = useContext(AppContext);

  async function onGoogleLoginSuccess(credentialResponse: CredentialResponse) {
    try {
      const response = await ApiService.login(credentialResponse.credential!)

      const accessToken = new Token(response.accessToken);
      accessToken.storeInCookie('accessToken');
      const refreshToken = new Token(response.refreshToken);
      refreshToken.storeInCookie('refreshToken');
      navigateTo(AppScreenEnum.Speech);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Request Failed:', error);
      } else {
        const backendError = (error as AxiosError<BackendError>).response?.data;
        console.error('Login Failed:', backendError);
      }
    }
  }

  return (
    <>
      <GoogleLogin
        shape={"pill"}
        theme="filled_blue"
        use_fedcm_for_prompt={true}
        onSuccess={onGoogleLoginSuccess}
        onError={() => {
          console.log('Login Failed:');
        }}
      />
    </>
  );
}

export default LoginScreen;