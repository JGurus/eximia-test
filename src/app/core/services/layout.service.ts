import { Injectable, signal } from '@angular/core';
import { LayoutType } from '@shared/models/layout.model';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private readonly STORAGE_KEY = 'eximia-layout-preference';
  private layoutType = signal<LayoutType>('left');

  readonly currentLayout = this.layoutType.asReadonly();
  readonly availableLayouts: LayoutType[] = ['left', 'top'];

  constructor() {
    this.loadLayoutPreference();
  }

  setLayout(layout: LayoutType): void {
    this.layoutType.set(layout);
    this.saveLayoutPreference(layout);
  }

  toggleLayout(): void {
    const current = this.layoutType();
    const next = current === 'left' ? 'top' : 'left';
    this.setLayout(next);
  }

  getLayoutName(type: LayoutType): string {
    const names: Record<LayoutType, string> = {
      'left': 'LeftLayout',
      'top': 'TopLayout'
    };
    return names[type];
  }

  private loadLayoutPreference(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored && this.isValidLayoutType(stored)) {
      this.layoutType.set(stored as LayoutType);
    }
  }

  private saveLayoutPreference(layout: LayoutType): void {
    localStorage.setItem(this.STORAGE_KEY, layout);
  }

  private isValidLayoutType(value: string): boolean {
    return this.availableLayouts.includes(value as LayoutType);
  }
}
