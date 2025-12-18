# Eximia

Sistema de gestión contable y administrativo desarrollado con Angular 21.

## Descripción General

Eximia es una aplicación web moderna que proporciona una solución completa para la gestión contable y administrativa de empresas. El sistema cuenta con módulos especializados para operaciones, gestión, contabilidad, nómina e informes, con un enfoque especial en la gestión del Plan de Cuentas contable.

## Características Principales

### 1. Sistema de Layouts Dinámicos

La aplicación ofrece dos modos de visualización que se adaptan a las preferencias del usuario:

#### Layout Izquierdo (Left Layout)
- Navegación vertical en sidebar izquierdo
- Menú desplegable con estructura jerárquica
- Ideal para pantallas anchas

#### Layout Superior (Top Layout)
- Navegación horizontal en barra superior
- Diseño más compacto
- Ideal para pantallas estrechas

**Funcionalidades:**
- Cambio de layout mediante botón de configuración en el header
- La preferencia se guarda en `localStorage` con la clave `eximia-layout-preference`
- El layout persiste entre sesiones
- Toggle instantáneo sin necesidad de recargar la página

**Implementación técnica:**
- Servicio centralizado: `LayoutService` (`src/app/core/services/layout.service.ts`)
- Tipos de layout: `'left'` | `'top'`
- Uso de Angular Signals para reactividad

### 2. Módulo Plan de Cuentas

El módulo más completo del sistema, ubicado en `src/app/pages/contabilidad/plan-cuentas/`, permite la gestión integral del catálogo de cuentas contables.

#### Estructura de Datos

Cada cuenta contiene:
- **Código**: Identificador único jerárquico (ej: `1.1.01`)
- **Nombre**: Descripción de la cuenta
- **Tipo**: Clasificación entre 30 tipos predefinidos (Efectivo, Cuenta bancaria, IVA compra, etc.)
- **Ajusta**: Configuración de ajuste por inflación (Monetaria, No monetaria, No ajusta)
- **Capítulo**: Clasificación contable (Activo, Pasivo, Patrimonio, Pérdidas, Ganancias)
- **Imputación**: Configuración de imputación (No imputa nunca, Imputar siempre)
- **Subcuentas**: Estructura jerárquica de cuentas hijas

#### Funcionalidades CRUD

**Agregar Cuenta:**
1. Click en botón "Agregar Cuenta" del header o menú contextual
2. Opcionalmente seleccionar un grupo padre
3. El sistema genera automáticamente el siguiente código disponible
4. Completar nombre (obligatorio) y campos opcionales
5. Confirmar para crear la cuenta

**Generación Automática de Códigos:**
- Nivel 1 (raíz): `1`, `2`, `3`, ...
- Nivel 2: `1.1`, `1.2`, `1.3`, ...
- Nivel 3+: `1.1.01`, `1.1.02`, `1.2.01`, ... (con padding de ceros)
- El sistema calcula el siguiente código basándose en los códigos existentes

**Editar Cuenta:**
1. Click derecho sobre la cuenta o seleccionar y usar menú contextual
2. Solo se pueden editar cuentas no predeterminadas
3. El código no puede modificarse (solo nombre y propiedades)
4. Cambios detectados automáticamente para habilitar/deshabilitar botón de guardar

**Eliminar Cuenta:**
1. Click derecho sobre la cuenta y seleccionar "Eliminar"
2. Si la cuenta tiene subcuentas:
   - Se muestra una lista de todas las cuentas que serán eliminadas
   - Confirmación requerida antes de eliminar
3. Si no tiene subcuentas:
   - Confirmación directa
4. Las cuentas predeterminadas no pueden eliminarse

#### Validaciones

**Validaciones del Formulario:**
- El nombre es obligatorio y no puede estar vacío
- Detección automática de cambios en el formulario
- Botón de confirmación deshabilitado si no hay cambios o datos inválidos

**Validaciones de Eliminación:**
- Verificación de cuentas hijas antes de eliminar
- Protección de cuentas predeterminadas (`isDefault: true`)
- Confirmación explícita del usuario

#### Sistema de Búsqueda

**Búsqueda Global:**
- Input de búsqueda en el header
- Busca simultáneamente por código y nombre
- Case-insensitive
- Expansión automática de cuentas padre cuando se encuentra coincidencia en cuentas hijo

**Búsqueda con Dropdowns:**
- Campos "Grupo", "Tipo", "Ajusta", "Capítulo", "Imputación"
- Filtrado en tiempo real
- Selección mediante click
- Limpieza de búsqueda al cerrar dropdown

**Implementación:**
```typescript
filterAccountsRecursive(accounts: Account[], searchTerm: string): Account[]
```
Busca recursivamente en la estructura jerárquica, manteniendo visible cualquier cuenta que coincida o que tenga hijos coincidentes.

#### Menú Contextual (Click Derecho)

**Activación:**
- Click derecho sobre cualquier cuenta en la lista
- Previene el menú nativo del navegador
- Se posiciona en las coordenadas del cursor

**Opciones del Menú:**

1. **+ Agregar**
   - Crea una nueva subcuenta bajo la cuenta seleccionada
   - Expande automáticamente la cuenta padre
   - Calcula el siguiente código hijo disponible

2. **Modificar**
   - Abre el formulario de edición
   - Deshabilitado para cuentas predeterminadas

3. **Eliminar**
   - Inicia el proceso de eliminación
   - Deshabilitado para cuentas predeterminadas
   - Valida subcuentas antes de proceder

**Cierre del Menú:**
- Click en cualquier parte fuera del menú
- Automático al seleccionar una opción
- Uso de `@HostListener` para detectar clicks externos

#### Datos Predeterminados

El sistema incluye una estructura inicial de cuentas:

**1 - Activos**
- 1.1 - Activos Corrientes
  - 1.1.01 - Caja General
  - 1.1.02 - Bancos
  - 1.1.03 - Cuentas por Cobrar
    - 1.1.03.01 - Clientes Nacionales
    - 1.1.03.02 - Clientes Extranjeros
- 1.2 - Activos No Corrientes
  - 1.2.01 - Propiedad, Planta y Equipo
  - 1.2.02 - Intangibles

**2 - Pasivos**
- 2.1 - Pasivos Corrientes
- 2.2 - Pasivos No Corrientes

**3 - Patrimonio**
- 3.1 - Capital

Estas cuentas están marcadas como `isDefault: true` y no pueden ser eliminadas ni modificadas.

### 3. Servicios Principales

#### HeaderService
**Ubicación:** `src/app/core/services/header.service.ts`

Gestiona el contenido dinámico del header:
- Título de la página actual
- Callback para botón "Volver"
- Limpieza automática al cambiar de página

#### NavigationService
**Ubicación:** `src/app/core/services/navigation.service.ts`

Define la estructura del menú de navegación:
- Aplicación
- Operaciones
- Gestión
- Contabilidad (Plan de Cuentas)
- Nómina
- Informes de gestión
- Informes contables
- Informe de Nóminas
- Reglas de negocio
- Ventanas

#### SearchService
**Ubicación:** `src/app/core/services/search.service.ts`

Proporciona búsqueda centralizada:
- Callback personalizado por página
- Placeholder configurable
- Integración con el input del header

#### ActionsService
**Ubicación:** `src/app/core/services/actions.service.ts`

Gestiona acciones dinámicas en el header:
- Botones específicos por página
- Renderizado mediante templates
- Ejemplo: botón "Agregar Cuenta" en Plan de Cuentas

## Estructura del Proyecto

```
src/
├── app/
│   ├── core/
│   │   └── services/           # Servicios centralizados
│   │       ├── layout.service.ts
│   │       ├── header.service.ts
│   │       ├── navigation.service.ts
│   │       ├── actions.service.ts
│   │       └── search.service.ts
│   ├── shared/
│   │   └── models/             # Modelos de datos
│   │       ├── layout.model.ts
│   │       ├── menu.model.ts
│   │       └── cuenta.model.ts
│   ├── layouts/
│   │   ├── left-layout/        # Layout con sidebar izquierdo
│   │   └── top-layout/         # Layout con navegación superior
│   ├── pages/
│   │   ├── aplicacion/
│   │   ├── operaciones/
│   │   ├── gestion/
│   │   ├── contabilidad/
│   │   │   └── plan-cuentas/   # Módulo principal
│   │   ├── nomina/
│   │   ├── informes-gestion/
│   │   ├── informes-contables/
│   │   ├── informe-nominas/
│   │   ├── reglas-negocio/
│   │   └── ventanas/
│   ├── app.ts                  # Componente raíz
│   ├── app.routes.ts           # Configuración de rutas
│   └── app.config.ts           # Configuración de la aplicación
├── main.ts                     # Punto de entrada
├── styles.css                  # Estilos globales
└── index.html
```

## Tecnologías y Patrones

### Tecnologías
- **Angular 21.0.0** - Framework principal
- **TypeScript** - Lenguaje de programación
- **Angular Signals** - Sistema de reactividad
- **Standalone Components** - Arquitectura sin módulos
- **CSS Grid** - Layout responsive
- **Bun 1.3.4** - Package manager

### Patrones de Diseño

#### Standalone Components
Todos los componentes utilizan la arquitectura standalone:
```typescript
@Component({
  selector: 'app-plan-cuentas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plan-cuentas.component.html',
  styleUrl: './plan-cuentas.component.css'
})
```

#### Angular Signals
Reactividad granular sin observables:
```typescript
private titleSignal = signal<string>('Eximia');
readonly title = this.titleSignal.asReadonly();
```

#### Control Flow Syntax
Nueva sintaxis de Angular 17+:
```html
@if (currentLayout() === 'left') {
  <app-left-layout />
} @else {
  <app-top-layout />
}

@for (account of accounts; track account.code) {
  <div>{{ account.name }}</div>
}
```

#### Lazy Loading
Carga de componentes bajo demanda:
```typescript
{
  path: 'contabilidad/plan-cuentas',
  loadComponent: () => import('./pages/contabilidad/plan-cuentas/plan-cuentas.component')
    .then(m => m.PlanCuentasComponent)
}
```

#### Inyección de Dependencias Moderna
```typescript
constructor() {
  private headerService = inject(HeaderService);
  private layoutService = inject(LayoutService);
}
```

## Instalación y Configuración

### Prerrequisitos
- Node.js (versión 18 o superior)
- Bun 1.3.4 o npm
- Angular CLI 21.0.3

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>

# Navegar al directorio
cd eximia

# Instalar dependencias con Bun
bun install

# O con npm
npm install
```

### Servidor de Desarrollo

```bash
# Iniciar servidor de desarrollo
ng serve

# O con Bun
bun run start
```

La aplicación estará disponible en `http://localhost:4200/`. Los cambios en el código se reflejarán automáticamente.

### Compilación para Producción

```bash
# Compilar para producción
ng build

# Los archivos se generarán en dist/
```

### Pruebas

```bash
# Ejecutar pruebas unitarias con Vitest
ng test

# Ejecutar pruebas end-to-end
ng e2e
```

## Rutas Principales

- `/aplicacion` - Página principal (ruta por defecto)
- `/operaciones` - Módulo de operaciones
- `/gestion` - Módulo de gestión
- `/contabilidad/plan-cuentas` - Plan de Cuentas (módulo principal)
- `/nomina` - Módulo de nómina
- `/informes-gestion` - Informes de gestión
- `/informes-contables` - Informes contables
- `/informe-nominas` - Informes de nóminas
- `/reglas-negocio` - Reglas de negocio
- `/ventanas` - Ventanas

## Flujo de Trabajo - Ejemplo: Agregar Cuenta

1. Usuario navega a `/contabilidad/plan-cuentas`
2. Click en botón "Agregar Cuenta" del header
3. Se abre panel lateral con formulario
4. Opcionalmente selecciona un grupo padre mediante búsqueda
5. Sistema calcula automáticamente el siguiente código
6. Usuario completa:
   - Nombre (obligatorio)
   - Tipo (opcional, con búsqueda entre 30 opciones)
   - Ajusta (opcional, 3 opciones)
   - Capítulo (opcional, 7 opciones)
   - Imputación (opcional, 2 opciones)
7. Click en "Confirmar"
8. Sistema valida datos
9. Cuenta se agrega a la estructura jerárquica
10. Panel lateral se cierra automáticamente
11. Nueva cuenta aparece en la lista, ordenada correctamente

## Características Técnicas Destacadas

### Gestión de Estado Complejo
- Estado local con objetos anidados (sidePanel, contextMenu, confirmModal)
- Sin necesidad de librerías de gestión de estado externas
- Uso intensivo de Signals para reactividad

### Búsqueda Jerárquica Recursiva
- Algoritmo que busca en toda la estructura de árbol
- Expansión automática de padres cuando hijos coinciden
- Mantiene la integridad de la jerarquía

### Generación Inteligente de Códigos
- Detecta automáticamente el nivel de anidación
- Aplica formato diferenciado según nivel
- Encuentra el máximo existente y genera el siguiente

### Persistencia de Datos
- LocalStorage para preferencias de usuario
- Clave: `eximia-layout-preference`
- Sincronización automática entre pestañas

### Templates Recursivos
- Renderizado de estructuras jerárquicas infinitas
- Uso de `ngTemplateOutlet` para recursión
- Gestión eficiente de niveles de profundidad

### Responsive Design
- CSS Grid para layouts adaptativos
- Dos modos de visualización completos
- Diseño mobile-friendly

## Recursos Adicionales

Para más información sobre Angular CLI:
- [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)
- [Angular Documentation](https://angular.dev)

## Licencia

Este proyecto fue generado usando [Angular CLI](https://github.com/angular/angular-cli) version 21.0.3.
