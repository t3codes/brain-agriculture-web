import { Component, Injectable, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, LegendPosition } from '@swimlane/ngx-charts';
import { BehaviorSubject, Observable } from 'rxjs';
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

// Serviço para gerenciar o estado do Dashboard
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private dashboardSubject = new BehaviorSubject<IDashboardState>({
    totalFarms: 0,
    totalHectares: 0,
    byState: [],
    byCrop: [],
    landUse: { arableArea: 0, vegetationArea: 0 },
  });

  dashboard$ = this.dashboardSubject.asObservable(); // Observable do estado

  constructor(private api: ApiService) {}

  // Método para carregar os dados do Dashboard
  loadDashboard(): void {
    this.api
      .get<IDashboardState>('dashboard/overview')
      .subscribe(
        (data) => {
          this.dashboardSubject.next(data); // Atualiza o estado
        },
        (error) => {
          console.error('Erro ao carregar dados do dashboard', error);
        }
      );
  }
}
