import {createContext} from "react";
import {AppPage} from "@/models/AppPage.ts";

export const AppContext = createContext({
  displayToast: (text: string) => {
  },
  navigateTo: (page: AppPage) => {
  },
});