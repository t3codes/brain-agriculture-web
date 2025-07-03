import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-layout',
  standalone: true, // ✅ importante pra standalone
  imports: [RouterModule, CommonModule], // ✅ Aqui adiciona o CommonModule
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {
  title = "testando 1 2 3"
}
