import {createContext} from "react";
import {AppScreenEnum} from "@/models/AppScreen.enum.ts";

export const AppContext = createContext({
  displayToast: (text: string) => {
  },
  navigateTo: (screen: AppScreenEnum) => {
  },
});