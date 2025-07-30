import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AstreReducer, AstreState } from "./astre.reducer";

// SELECT / GET DATA

export const selectAstreState = createFeatureSelector<AstreState>("Astre");

export const selectAstres = createSelector(
  selectAstreState,
  (state) => state.astres
);
export const selectAstresLoading = createSelector(
  selectAstreState,
  (state) => state.loading
);
