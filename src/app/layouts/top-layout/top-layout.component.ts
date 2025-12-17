import {
  Component,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HeaderService } from '@core/services/header.service';
import { LayoutService } from '@core/services/layout.service';
import { NavigationService } from '@core/services/navigation.service';
import { ActionsService } from '@core/services/actions.service';
import { SearchService } from '@core/services/search.service';
import { MenuItem } from '@shared/models/menu.model';
import { filter, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-top-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './top-layout.component.html',
  styleUrl: './top-layout.component.css',
})
export class TopLayoutComponent implements OnInit, OnDestroy {
  protected readonly headerService = inject(HeaderService);
  protected readonly navigationService = inject(NavigationService);
  protected readonly layoutService = inject(LayoutService);
  protected readonly actionsService = inject(ActionsService);
  protected readonly searchService = inject(SearchService);
  protected readonly router = inject(Router);

  protected searchQuery = '';

  protected readonly title = this.headerService.title;
  protected readonly onBack = this.headerService.onBack;
  protected readonly menuItems = this.navigationService.getMenuItems();

  // Estado de expansión de menús dropdown (usando el label como key)
  protected expandedMenus = signal<Record<string, boolean>>({});

  private routerSubscription?: Subscription;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Verificar si el click fue dentro de un botón de menú o dentro del dropdown
    const isMenuButton = target.closest('.navbar-toggle');
    const isDropdownMenu = target.closest('.dropdown-menu');

    // Si no es ninguno de los dos, cerrar todos los menús
    if (!isMenuButton && !isDropdownMenu) {
      this.closeAllMenus();
    }
  }

  ngOnInit(): void {
    // Suscribirse a cambios de navegación
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.syncMenusWithRoute();
      });
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  protected handleBack(): void {
    const backFn = this.onBack();
    if (backFn) {
      backFn();
    }
  }

  private syncMenusWithRoute(): void {
    const currentUrl = this.router.url;
    const newExpandedState: Record<string, boolean> = {};

    // Recorrer todos los menús con hijos
    this.menuItems.forEach((menuItem) => {
      if (menuItem.children && menuItem.children.length > 0) {
        // Verificar si algún hijo coincide con la ruta actual
        const hasMatchingChild = menuItem.children.some((child) => {
          return child.route && currentUrl.startsWith(child.route);
        });

        // Establecer el estado de expansión basado en si tiene hijo activo
        newExpandedState[menuItem.label] = hasMatchingChild;
      }
    });

    // Actualizar el estado de expansión
    this.expandedMenus.set(newExpandedState);
  }

  protected hasChildren(item: MenuItem): boolean {
    return this.navigationService.hasChildren(item);
  }

  protected isExpanded(item: MenuItem): boolean {
    return this.expandedMenus()[item.label] || false;
  }

  protected toggleMenu(item: MenuItem): void {
    const isCurrentlyExpanded = this.isExpanded(item);

    if (isCurrentlyExpanded) {
      // Si ya está expandido, solo lo cierra
      this.expandedMenus.update((state) => ({
        ...state,
        [item.label]: false,
      }));
    } else {
      // Si no está expandido, cierra todos los demás y abre este
      this.expandedMenus.set({ [item.label]: true });
    }
  }

  protected closeAllMenus(): void {
    this.expandedMenus.set({});
  }

  protected hasActiveChild(item: MenuItem): boolean {
    if (!item.children || item.children.length === 0) {
      return false;
    }

    const currentUrl = this.router.url;
    return item.children.some((child) => {
      if (child.route) {
        return currentUrl.startsWith(child.route);
      }
      return false;
    });
  }

  protected switchLayout(): void {
    this.layoutService.toggleLayout();
  }

  protected onSearchInput(): void {
    this.searchService.onSearch(this.searchQuery);
  }

  protected clearSearch(): void {
    this.searchQuery = '';
    this.searchService.clearSearch();
  }
}
