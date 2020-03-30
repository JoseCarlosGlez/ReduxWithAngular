import { ActionReducerMap } from "@ngrx/store";
import * as ui from "./ui/ui.reducer";
import * as au from "./auth/auth.reducer";

export interface AppState {
  ui: ui.State;
  au: au.State;
}

export const appReducers: ActionReducerMap<AppState> = {
  ui: ui.uiReducer,
  au: au.authReducer
};
