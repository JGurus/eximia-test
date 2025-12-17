import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HeaderService {
  private titleSignal = signal<string>('Eximia');
  private onBackSignal = signal<(() => void) | null>(null);

  readonly title = this.titleSignal.asReadonly();
  readonly onBack = this.onBackSignal.asReadonly();

  setTitle(title: string): void {
    this.titleSignal.set(title);
  }

  setOnBack(callback: (() => void) | null): void {
    this.onBackSignal.set(callback);
  }

  clearHeader(): void {
    this.titleSignal.set('Eximia');
    this.onBackSignal.set(null);
  }
}
