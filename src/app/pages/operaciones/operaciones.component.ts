import { Component, inject, OnInit } from '@angular/core';
import { HeaderService } from '@core/services/header.service';

@Component({
  selector: 'app-operaciones',
  standalone: true,
  imports: [],
  templateUrl: './operaciones.component.html',
  styleUrl: './operaciones.component.css'
})
export class OperacionesComponent implements OnInit {
  private readonly headerService = inject(HeaderService);

  ngOnInit(): void {
    this.headerService.setTitle('Operaciones');
  }
}
