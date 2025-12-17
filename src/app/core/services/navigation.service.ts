import { Injectable } from '@angular/core';
import { MenuItem } from '@shared/models/menu.model';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  readonly menuItems: MenuItem[] = [
    {
      label: 'Aplicación',
      route: '/aplicacion',
      icon: '📱'
    },
    {
      label: 'Operaciones',
      route: '/operaciones',
      icon: '⚙️'
    },
    {
      label: 'Gestión',
      route: '/gestion',
      icon: '📈'
    },
    {
      label: 'Contabilidad',
      icon: '💰',
      children: [
        {
          label: 'Plan de Cuentas',
          route: '/contabilidad/plan-cuentas',
          icon: '📋'
        }
      ]
    },
    {
      label: 'Nómina',
      route: '/nomina',
      icon: '💵'
    },
    {
      label: 'Informes de gestión',
      route: '/informes-gestion',
      icon: '📊'
    },
    {
      label: 'Informes contables',
      route: '/informes-contables',
      icon: '📑'
    },
    {
      label: 'Informe de Nóminas',
      route: '/informe-nominas',
      icon: '📄'
    },
    {
      label: 'Reglas de negocio',
      route: '/reglas-negocio',
      icon: '📏'
    },
    {
      label: 'Ventanas',
      route: '/ventanas',
      icon: '🪟'
    }
  ];

  getMenuItems(): MenuItem[] {
    return this.menuItems;
  }

  hasChildren(item: MenuItem): boolean {
    return !!item.children && item.children.length > 0;
  }
}
