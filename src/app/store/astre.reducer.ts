import { createReducer, on } from "@ngrx/store";
import * as AstreActions from "./astre.actions";
import { Astre } from "../models/Astre";
import { ActionStatus } from "./action.state";

export const astreFeatureKey = "Astre"; // <-- make sure this matches

export interface AstreState {
  astres: Astre[];
  loading: boolean;
  error: string;

  // Because an effect doesn't return anything, we will use a field to check state after effect/action
  addStatus: ActionStatus;
  loadStatus: ActionStatus;
}

export const initialState: AstreState = {
  astres: [],
  loading: false,
  error: "",
  addStatus: ActionStatus.PENDING,
  loadStatus: ActionStatus.PENDING,
};

export const AstreReducer = createReducer(
  initialState,

  // ADD
  on(AstreActions.addAstres, (state, { newastres }) => ({
    ...state, // spread operator to duplicate
    astres: [...state.astres, ...newastres], // add  addtional data
  })),

  on(AstreActions.addAstresSuccess, (state) => ({
    ...state,
    addStatus: ActionStatus.SUCCESS,
  })),

  on(AstreActions.addAstresFailure, (state) => ({
    ...state,
    addStatus: ActionStatus.FAILURE,
  })),

  // DELETE
  on(AstreActions.deleteAstres, (state, { astreID }) => ({
    ...state,
    astres: state.astres.filter(
      (astre) =>
        !(
          astre.astreID.name === astreID.name &&
          astre.astreID.type === astreID.type
        )
    ),
    loading: false,
  })),

  on(AstreActions.clearAstres, (state) => initialState),
  // LOAD
  on(AstreActions.loadAstres, (state) => ({ ...state, loading: true })),

  on(AstreActions.loadAstresSuccess, (state, { astres }) => ({
    ...state,
    astres,
    error: "",
    addStatus: ActionStatus.SUCCESS,
  })),

  on(AstreActions.loadAstresFailure, (state, { error }) => ({
    ...state,
    loading: false,
    addStatus: ActionStatus.FAILURE,
  }))
);
