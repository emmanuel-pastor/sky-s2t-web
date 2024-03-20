import {CredentialResponse, GoogleLogin} from "@react-oauth/google";
import axios, {AxiosError} from "axios";
import TokenResponse from "@/models/TokenResponse.ts";
import Cookies from "js-cookie";
import BackendError from "@/models/BackendError.ts";

function LoginScreen() {
  async function onGoogleLoginSuccess(credentialResponse: CredentialResponse) {
    try {
      const response = await axios.post<TokenResponse>('http://localhost:7071/api/login', {}, {
        headers: {
          'Authorization': `Bearer ${credentialResponse.credential}`,
          'Content-Type': 'application/json'
        }
      })

      Cookies.set('refreshToken', response.data.refreshToken, {secure: true});
      Cookies.set('accessToken', response.data.accessToken, {secure: true});
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