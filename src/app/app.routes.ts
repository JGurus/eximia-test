import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'aplicacion', pathMatch: 'full' },
  {
    path: 'aplicacion',
    loadComponent: () => import('./pages/aplicacion/aplicacion.component').then(m => m.AplicacionComponent)
  },
  {
    path: 'operaciones',
    loadComponent: () => import('./pages/operaciones/operaciones.component').then(m => m.OperacionesComponent)
  },
  {
    path: 'gestion',
    loadComponent: () => import('./pages/gestion/gestion.component').then(m => m.GestionComponent)
  },
  {
    path: 'contabilidad/plan-cuentas',
    loadComponent: () => import('./pages/contabilidad/plan-cuentas/plan-cuentas.component').then(m => m.PlanCuentasComponent)
  },
  {
    path: 'nomina',
    loadComponent: () => import('./pages/nomina/nomina.component').then(m => m.NominaComponent)
  },
  {
    path: 'informes-gestion',
    loadComponent: () => import('./pages/informes-gestion/informes-gestion.component').then(m => m.InformesGestionComponent)
  },
  {
    path: 'informes-contables',
    loadComponent: () => import('./pages/informes-contables/informes-contables.component').then(m => m.InformesContablesComponent)
  },
  {
    path: 'informe-nominas',
    loadComponent: () => import('./pages/informe-nominas/informe-nominas.component').then(m => m.InformeNominasComponent)
  },
  {
    path: 'reglas-negocio',
    loadComponent: () => import('./pages/reglas-negocio/reglas-negocio.component').then(m => m.ReglasNegocioComponent)
  },
  {
    path: 'ventanas',
    loadComponent: () => import('./pages/ventanas/ventanas.component').then(m => m.VentanasComponent)
  }
];
