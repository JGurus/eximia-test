import { Component, inject, OnInit } from '@angular/core';
import { HeaderService } from '@core/services/header.service';

@Component({
  selector: 'app-informe-nominas',
  standalone: true,
  imports: [],
  templateUrl: './informe-nominas.component.html',
  styleUrl: './informe-nominas.component.css'
})
export class InformeNominasComponent implements OnInit {
  private readonly headerService = inject(HeaderService);

  ngOnInit(): void {
    this.headerService.setTitle('Informe de Nóminas');
  }
}
