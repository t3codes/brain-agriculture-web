// src/app/dashboard/store/dashboard.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../../../core/api.service';

// Interfaces do estado
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

// Novo tipo com status de loading e erro
export interface DashboardViewState extends IDashboardState {
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private dashboardSubject = new BehaviorSubject<DashboardViewState>({
    totalFarms: 0,
    totalHectares: 0,
    byState: [],
    byCrop: [],
    landUse: { arableArea: 0, vegetationArea: 0 },
    loading: true,
    error: null,
  });

  dashboard$ = this.dashboardSubject.asObservable();

  constructor(private api: ApiService) {}

  loadDashboard(): void {
    this.dashboardSubject.next({
      ...this.dashboardSubject.value,
      loading: true,
      error: null,
    });

    this.api.get<IDashboardState>('dashboard/overview').subscribe({
      next: (data) => {
        this.dashboardSubject.next({
          ...data,
          loading: false,
          error: null,
        });
      },
      error: (err) => {
        console.error('Erro ao carregar dashboard:', err);
        this.dashboardSubject.next({
          ...this.dashboardSubject.value,
          loading: false,
          error: 'Erro ao carregar os dados do dashboard',
        });
      },
    });
  }
}
