import { Injectable, TemplateRef, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {
  private actionsTemplate = signal<TemplateRef<any> | null>(null);

  readonly actions = this.actionsTemplate.asReadonly();

  setActions(template: TemplateRef<any> | null): void {
    this.actionsTemplate.set(template);
  }

  clearActions(): void {
    this.actionsTemplate.set(null);
  }
}
