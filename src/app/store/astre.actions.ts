import { createAction, props } from "@ngrx/store";
import { Astre, AstreID } from "../models/Astre";

// LOAD
export const loadAstres = createAction("[Astre] Load Astre");
export const loadAstresSuccess = createAction(
  "[Astre] Load Astres Success", // [source] name of the action
  props<{ astres: Astre[] }>() // payload of the action
);
export const loadAstresFailure = createAction(
  "[Astre] Load Astres Failure",
  props<{ error: string }>()
);

// ADD
export const addAstres = createAction(
  "[Astre] Add Astre",
  props<{ newastres: Astre[] }>()
);
export const addAstresSuccess = createAction("[Astre] Add Astre Success");
export const addAstresFailure = createAction("[Astre] Add Astre Failure");

// DELETE
export const deleteAstres = createAction(
  "[Astre] Delete Astre",
  props<{ astreID: AstreID }>()
);

// FILLER
export const actionComplete = createAction("[Astre] Action completed");
