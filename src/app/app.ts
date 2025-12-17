import { Component, inject, signal } from '@angular/core';
import { LayoutService } from '@core/services/layout.service';
import { LeftLayoutComponent } from '@layouts/left-layout/left-layout.component';
import { TopLayoutComponent } from '@layouts/top-layout/top-layout.component';

@Component({
  selector: 'app-root',
  imports: [LeftLayoutComponent, TopLayoutComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly layoutService = inject(LayoutService);
  protected readonly currentLayout = this.layoutService.currentLayout;
  protected readonly title = signal('eximia');
}
