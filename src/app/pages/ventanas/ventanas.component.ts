import { Component, inject, OnInit } from '@angular/core';
import { HeaderService } from '@core/services/header.service';

@Component({
  selector: 'app-ventanas',
  standalone: true,
  imports: [],
  templateUrl: './ventanas.component.html',
  styleUrl: './ventanas.component.css'
})
export class VentanasComponent implements OnInit {
  private readonly headerService = inject(HeaderService);

  ngOnInit(): void {
    this.headerService.setTitle('Ventanas');
  }
}
