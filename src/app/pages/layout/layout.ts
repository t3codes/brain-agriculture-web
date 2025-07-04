import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {
  title = "testando 1 2 3";

  constructor(private router: Router) {}

  ngOnInit() {
    console.log('LayoutComponent carregado');
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    this.router.navigate(['/login']); 
  }
}