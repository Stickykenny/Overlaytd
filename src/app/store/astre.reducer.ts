import { createReducer, on } from "@ngrx/store";
import * as AstreActions from "./astre.actions";
import { Astre } from "../models/Astre";

export const astreFeatureKey = "Astre"; // <-- make sure this matches

export interface AstreState {
  astres: Astre[];
  loading: boolean;
  error: string;
}

export const initialState: AstreState = {
  astres: [],
  loading: false,
  error: "",
};

export const AstreReducer = createReducer(
  initialState,
  on(AstreActions.addAstres, (state, { astres }) => ({
    ...state, // spread operator to duplicate
    astres, // add  addtional data
    loading: false,
  })),

  on(AstreActions.deleteAstres, (state, { astreID }) => ({
    ...state,
    astres: state.astres.filter((astre) => astre.astreID !== astreID),
    loading: false,
  })),

  on(AstreActions.loadAstres, (state) => ({ ...state, loading: true })),

  on(AstreActions.loadAstresSuccess, (state, { astres }) => ({
    ...state,
    astres,
    error: "",
    loading: false,
  })),

  on(AstreActions.loadAstresFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
