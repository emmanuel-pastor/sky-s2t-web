import {ThemeProvider} from "@/components/theme-provider.tsx";
import {useState} from "react";
import {AppContext} from "@/context/AppContext.ts";
import {AppScreen} from "@/models/AppScreen.ts";
import {Toaster} from "@/components/ui/toaster.tsx";
import {useToast} from "@/components/ui/use-toast.ts";
import LoginScreen from "@/screens/LoginScreen.tsx";
import SpeechScreen from "@/screens/SpeechScreen.tsx";

function App() {
  const {toast} = useToast();
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.Home);

  const displayToast = (text: string) => {
    toast({
      variant: 'destructive',
      description: text,
    })
  }

  const navigateTo = (page: AppScreen) => {
    setCurrentScreen(page);
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AppContext.Provider value={{displayToast, navigateTo}}>
        {currentScreen == AppScreen.Login && <LoginScreen/>}
        {currentScreen == AppScreen.Speech && <SpeechScreen/>}
        <Toaster/>
      </AppContext.Provider>
    </ThemeProvider>
  )
}

export default App
