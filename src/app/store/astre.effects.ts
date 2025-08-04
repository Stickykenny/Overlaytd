import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ApiService } from "../api.service";
import * as AstreActions from "./astre.actions";
import { catchError, map, mergeMap, of, switchMap } from "rxjs";
import { Store } from "@ngrx/store";
import { AstreState } from "./astre.reducer";
import { ToastrService } from "ngx-toastr";

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
      switchMap(() =>
        this.api.getAstres().pipe(
          map((astres) => AstreActions.loadAstresSuccess({ astres })),
          catchError((error) => of(AstreActions.loadAstresFailure({ error })))
        )
      )
    )
  );

  addAstres$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AstreActions.addAstres),
      switchMap((action) =>
        this.api.postAstres(action.newastres).pipe(
          map(() => AstreActions.addAstresSuccess()),
          catchError((error) => of(AstreActions.addAstresFailure()))
        )
      )
    )
  );
  deleteAstres$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AstreActions.deleteAstres),
      switchMap((action) =>
        this.api
          .deleteAstre(action.astreID.type, action.astreID.name)
          .pipe(map(() => AstreActions.actionComplete()))
      )
    )
  );
}
