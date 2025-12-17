import { Component, inject, OnInit } from '@angular/core';
import { HeaderService } from '@core/services/header.service';

@Component({
  selector: 'app-informes-contables',
  standalone: true,
  imports: [],
  templateUrl: './informes-contables.component.html',
  styleUrl: './informes-contables.component.css'
})
export class InformesContablesComponent implements OnInit {
  private readonly headerService = inject(HeaderService);

  ngOnInit(): void {
    this.headerService.setTitle('Informes contables');
  }
}
