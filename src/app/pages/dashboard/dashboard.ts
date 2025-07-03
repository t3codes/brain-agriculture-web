import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, LegendPosition } from '@swimlane/ngx-charts';
import { catchError, finalize, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { ByCrop, ByState, IDashboardState, loadDashboard } from '../../store/auth.state';
import { Store } from '@ngrx/store';
import { DashboardService } from './store/dashboard.redux';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {
  totalFarms = 0;
  totalHectares = 0;
  isLoading = true;
  errorMessage = '';

  chartByState: any[] = [];
  chartByCrop: any[] = [];
  chartLandUse: any[] = [];

  view: [number, number] = [500, 400];
  legendPosition = LegendPosition.Below;

  constructor(
    private api: ApiService,
    private dashboardService: DashboardService
  ) { }

  byState$!: Observable<ByState[]>;
  byCrop$!: Observable<ByCrop[]>;


 ngOnInit(): void {
    this.dashboardService.loadDashboard();

    this.dashboardService.dashboard$.subscribe((state) => {
      this.totalFarms = state.totalFarms;
      this.totalHectares = state.totalHectares;

      this.chartByState = state.byState.map(s => ({
        name: s.state,
        value: s.total
      }));

      this.chartByCrop = state.byCrop.map(c => ({
        name: c.name,
        value: c.total
      }));

      this.chartLandUse = [
        { name: 'Área Agricultável', value: state.landUse.arableArea },
        { name: 'Vegetação', value: state.landUse.vegetationArea }
      ];
    });
  }
}


