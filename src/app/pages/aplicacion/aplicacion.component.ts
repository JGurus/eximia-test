import { Component, inject, OnInit } from '@angular/core';
import { HeaderService } from '@core/services/header.service';

@Component({
  selector: 'app-aplicacion',
  standalone: true,
  imports: [],
  templateUrl: './aplicacion.component.html',
  styleUrl: './aplicacion.component.css'
})
export class AplicacionComponent implements OnInit {
  private readonly headerService = inject(HeaderService);

  ngOnInit(): void {
    this.headerService.setTitle('Aplicación');
  }
}
