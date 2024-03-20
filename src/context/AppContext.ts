import {createContext} from "react";
import {AppScreen} from "@/models/AppScreen.ts";

export const AppContext = createContext({
  displayToast: (text: string) => {
  },
  navigateTo: (screen: AppScreen) => {
  },
});