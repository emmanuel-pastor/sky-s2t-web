import {CredentialResponse, GoogleLogin} from "@react-oauth/google";
import axios, {AxiosError} from "axios";
import TokenResponse from "@/models/TokenResponse.ts";
import BackendError from "@/models/BackendError.ts";
import Token from "@/models/Token.ts";

function LoginScreen() {
  async function onGoogleLoginSuccess(credentialResponse: CredentialResponse) {
    try {
      const response = await axios.post<TokenResponse>('http://localhost:7071/api/login', {}, {
        headers: {
          'Authorization': `Bearer ${credentialResponse.credential}`,
          'Content-Type': 'application/json'
        }
      })

      const accessToken = new Token(response.data.accessToken);
      accessToken.storeInCookie('accessToken');
      const refreshToken = new Token(response.data.refreshToken);
      refreshToken.storeInCookie('refreshToken');
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