import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchQuery = signal<string>('');
  private searchCallback = signal<((query: string) => void) | null>(null);
  private searchPlaceholder = signal<string>('Buscar...');

  readonly query = this.searchQuery.asReadonly();
  readonly placeholder = this.searchPlaceholder.asReadonly();

  setSearchCallback(callback: (query: string) => void, placeholder?: string): void {
    this.searchCallback.set(callback);
    if (placeholder) {
      this.searchPlaceholder.set(placeholder);
    }
  }

  clearSearchCallback(): void {
    this.searchCallback.set(null);
    this.searchQuery.set('');
    this.searchPlaceholder.set('Buscar...');
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    const callback = this.searchCallback();
    if (callback) {
      callback(query);
    }
  }

  clearSearch(): void {
    this.searchQuery.set('');
    const callback = this.searchCallback();
    if (callback) {
      callback('');
    }
  }
}
