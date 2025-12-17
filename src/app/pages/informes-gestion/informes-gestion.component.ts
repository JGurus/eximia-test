import { Component, inject, OnInit } from '@angular/core';
import { HeaderService } from '@core/services/header.service';

@Component({
  selector: 'app-informes-gestion',
  standalone: true,
  imports: [],
  templateUrl: './informes-gestion.component.html',
  styleUrl: './informes-gestion.component.css'
})
export class InformesGestionComponent implements OnInit {
  private readonly headerService = inject(HeaderService);

  ngOnInit(): void {
    this.headerService.setTitle('Informes de gestión');
  }
}
