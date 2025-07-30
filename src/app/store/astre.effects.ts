import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ApiService } from "../api.service";
import * as AstreActions from "./astre.actions";
import { catchError, map, mergeMap, of, switchMap } from "rxjs";
import { Store } from "@ngrx/store";
import { AstreState } from "./astre.reducer";

//

@Injectable()
export class AstreEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AstreState>,
    private api: ApiService
  ) {}

  loadAstres$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AstreActions.loadAstres),
      // switch to new observable string
      switchMap(() =>
        this.api.getAstres().pipe(
          map((astres) => AstreActions.loadAstresSuccess({ astres })),
          catchError((error) => of(AstreActions.loadAstresFailure({ error })))
        )
      )
    )
  );

  saveAstres$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AstreActions.addAstres),
      // switch to new observable string
      switchMap(() =>
        this.api.getAstres().pipe(
          map((astres) => AstreActions.loadAstresSuccess({ astres })),
          catchError((error) => of(AstreActions.loadAstresFailure({ error })))
        )
      )
    )
  );
  /*deleteAstres$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AstreActions.deleteAstres),
      // switch to new observable string
      switchMap((action) =>
        this.api.deleteAstre(action.astreID.type, action.astreID.name).pipe(
        )
      )
    )
  );*/
}
