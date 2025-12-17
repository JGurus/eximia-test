import { Component, inject, OnInit } from '@angular/core';
import { HeaderService } from '@core/services/header.service';

@Component({
  selector: 'app-reglas-negocio',
  standalone: true,
  imports: [],
  templateUrl: './reglas-negocio.component.html',
  styleUrl: './reglas-negocio.component.css'
})
export class ReglasNegocioComponent implements OnInit {
  private readonly headerService = inject(HeaderService);

  ngOnInit(): void {
    this.headerService.setTitle('Reglas de negocio');
  }
}
