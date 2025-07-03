import { Injectable } from "@angular/core";
import { createAction, createReducer, on, props } from "@ngrx/store";
import { ApiService } from "../core/api.service";
import { catchError, map, mergeMap, of } from "rxjs";
import { Actions, createEffect, ofType } from "@ngrx/effects";

export interface IDashboardState {
  totalFarms: number;
  totalHectares: number;
  byState: ByState[];
  byCrop: ByCrop[];
  landUse: LandUse;
}

export interface ByState {
  state: string;
  total: number;
}

export interface ByCrop {
  name: string;
  total: number;
}

export interface LandUse {
  arableArea: number;
  vegetationArea: number;
}


// REDUICER
export const initialDashboardState: IDashboardState = {
  totalFarms: 0,
  totalHectares: 0,
  byState: [],
  byCrop: [],
  landUse: {
    arableArea: 0,
    vegetationArea: 0,
  },
};


// ACTION
export const loadDashboard = createAction('[Dashboard] Load Dashboard');
export const loadDashboardSuccess = createAction(
  '[Dashboard] Load Dashboard Success',
  props<{ dashboard: IDashboardState }>()
);
export const loadDashboardFailure = createAction(
  '[Dashboard] Load Dashboard Failure',
  props<{ error: string }>()
);
export const dashboardReducer = createReducer(
  initialDashboardState,
  on(loadDashboardSuccess, (state, { dashboard }) => ({
    ...state,
    ...dashboard
  })),
  on(loadDashboardFailure, (state, { error }) => ({
    ...state
  }))
);



// EFFECT
@Injectable()
export class DashboardEffects {
  constructor(
    private actions$: Actions,
    private api: ApiService
  ) {}

  loadDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDashboard),
      mergeMap(() =>
        this.api.get<IDashboardState>('dashboard/overview').pipe(
          map(dashboard => loadDashboardSuccess({ dashboard })),
          catchError(error =>
            of(loadDashboardFailure({ error: 'Erro ao carregar dados do dashboard' }))
          )
        )
      )
    )
  );
}