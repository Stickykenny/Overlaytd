import { createAction, props } from "@ngrx/store";
import { Astre, AstreID } from "../models/Astre";

export const loadAstres = createAction("[Astre] Load Astre");
export const loadAstresSuccess = createAction(
  "[Astre] Load Astres Success", // [source] name of the action
  props<{ astres: Astre[] }>() // payload of the action
);
export const loadAstresFailure = createAction(
  "[Astre] Load Astres Failure",
  props<{ error: string }>()
);

export const addAstres = createAction(
  "[Astre] Add Astre",
  props<{ astres: Astre[] }>()
);
export const deleteAstres = createAction(
  "[Astre] Delete Astre",
  props<{ astreID: AstreID }>()
);
