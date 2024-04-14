import {createContext} from "react";
import {AppScreenEnum} from "@/models/AppScreen.enum.ts";

export const AppContext = createContext({
  displayToast: {} as (text: string) => void,
  navigateTo: {} as (screen: AppScreenEnum) => void,
});