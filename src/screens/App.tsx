import {ThemeProvider} from "@/components/theme-provider.tsx";
import {useEffect, useState} from "react";
import {AppContext} from "@/context/AppContext.ts";
import {AppScreenEnum} from "@/models/AppScreen.enum.ts";
import {Toaster} from "@/components/ui/toaster.tsx";
import {useToast} from "@/components/ui/use-toast.ts";
import LoginScreen from "@/screens/LoginScreen.tsx";
import SpeechScreen from "@/screens/SpeechScreen.tsx";
import Token from "@/models/Token.ts";
import axios from "axios";
import TokenResponse from "@/models/TokenResponse.ts";

function App() {
  const {toast} = useToast();
  const [currentScreen, setCurrentScreen] = useState<AppScreenEnum>(AppScreenEnum.Home);

  useEffect(() => {
    const accessToken = Token.fromCookie('accessToken');
    const refreshToken = Token.fromCookie('refreshToken');

    if (accessToken && !accessToken.isExpired) {
      navigateTo(AppScreenEnum.Speech)
    } else {
      if (refreshToken && !refreshToken.isExpired) {
        axios.post<TokenResponse>('http://localhost:7071/api/refreshToken', {}, {
          headers: {
            'Authorization': `Bearer ${refreshToken.toString()}`,
            'Content-Type': 'application/json'
          }
        }).then(response => {
          const newAccessToken = new Token(response.data.accessToken)
          newAccessToken.storeInCookie('accessToken')
          const newRefreshToken = new Token(response.data.refreshToken)
          newRefreshToken.storeInCookie('refreshToken')
          navigateTo(AppScreenEnum.Speech)
        })
      } else {
        navigateTo(AppScreenEnum.Login)
      }
    }
  }, [])

  const displayToast = (text: string) => {
    toast({
      variant: 'destructive',
      description: text,
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
        <Toaster/>
      </AppContext.Provider>
    </ThemeProvider>
  )
}

export default App
