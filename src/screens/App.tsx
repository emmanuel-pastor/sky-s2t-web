import {ThemeProvider} from "@/components/theme-provider.tsx";
import {useEffect, useState} from "react";
import {AppContext} from "@/context/AppContext.ts";
import {AppScreenEnum} from "@/models/AppScreen.enum.ts";
import {Toaster} from "@/components/ui/toaster.tsx";
import {useToast} from "@/components/ui/use-toast.ts";
import LoginScreen from "@/screens/LoginScreen.tsx";
import SpeechScreen from "@/screens/SpeechScreen.tsx";
import Token from "@/models/Token.ts";
import ApiService from "@/lib/ApiService.ts";
import {AxiosError} from "axios";
import BackendError from "@/models/BackendError.ts";
import ErrorMessageService from "@/lib/ErrorMessageService.ts";
import {LoadingSpinner} from "@/components/ui/loading-spinner.tsx";

function App() {
  const {toast} = useToast();
  const [currentScreen, setCurrentScreen] = useState<AppScreenEnum>(AppScreenEnum.Home);

  useEffect(() => {
    if (currentScreen !== AppScreenEnum.Home) return;

    const accessToken = Token.fromCookie('accessToken');
    const refreshToken = Token.fromCookie('refreshToken');

    if (accessToken && !accessToken.isExpired) {
      navigateTo(AppScreenEnum.Speech)
    } else {
      if (refreshToken && !refreshToken.isExpired) {
        ApiService.refreshToken(refreshToken).then(response => {
          const newAccessToken = new Token(response.accessToken)
          newAccessToken.storeInCookie('accessToken')
          const newRefreshToken = new Token(response.refreshToken)
          newRefreshToken.storeInCookie('refreshToken')
          navigateTo(AppScreenEnum.Speech)
        }).catch(error => {
          const backendError = (error as AxiosError<BackendError>).response?.data;
          const errorMessage = ErrorMessageService.getErrorMessage(backendError);
          displayToast(errorMessage);
          navigateTo(AppScreenEnum.Login)
        })
      } else {
        navigateTo(AppScreenEnum.Login)
      }
    }
  }, [currentScreen])

  const displayToast = (text: string) => {
    toast({
      variant: 'destructive',
      description: text,
      duration: 5000,
    })
  }

  const navigateTo = (page: AppScreenEnum) => {
    setCurrentScreen(page);
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AppContext.Provider value={{displayToast, navigateTo}}>
        {currentScreen == AppScreenEnum.Login && <LoginScreen/>}
        {currentScreen == AppScreenEnum.Speech && <SpeechScreen/>}
        {currentScreen == AppScreenEnum.Home &&
            <div className="absolute inset-0 grid place-content-center">
                <LoadingSpinner/>
            </div>
        }
        <Toaster/>
      </AppContext.Provider>
    </ThemeProvider>
  )
}

export default App
