import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, TemplateRef, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderService } from '@core/services/header.service';
import { ActionsService } from '@core/services/actions.service';
import { SearchService } from '@core/services/search.service';
import { Account } from '@shared/models/cuenta.model';

@Component({
  selector: 'app-plan-cuentas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plan-cuentas.component.html',
  styleUrl: './plan-cuentas.component.css'
})
export class PlanCuentasComponent implements OnInit, AfterViewInit, OnDestroy {
  private headerService = inject(HeaderService);
  private actionsService = inject(ActionsService);
  private searchService = inject(SearchService);

  searchQuery = '';
  filteredAccounts: Account[] = [];

  @ViewChild('actions', { static: false })
  actionsTemplate?: TemplateRef<any>;

  contextMenu = {
    visible: false,
    x: 0,
    y: 0,
    account: null as Account | null
  };

  confirmModal = {
    visible: false,
    message: '',
    type: 'cancel' as 'cancel' | 'delete',
    accountToDelete: null as Account | null
  };

  sidePanel = {
    visible: false,
    mode: 'add' as 'add' | 'edit' | 'delete',
    parentAccount: null as Account | null,
    formData: {
      group: '',
      code: '',
      name: '',
      type: '',
      ajusta: '',
      capitulo: '',
      imputacion: ''
    }
  };

  deletePanelData = {
    accountToDelete: null as Account | null,
    accountsToDelete: [] as Account[]
  };

  initialFormState = {
    group: '',
    name: '',
    type: '',
    ajusta: '',
    capitulo: '',
    imputacion: '',
    parentAccount: null as Account | null
  };

  groupSearch = {
    query: '',
    results: [] as Account[],
    showDropdown: false,
    selectedGroup: null as Account | null
  };

  accountTypes = [
    'Título',
    'Cuenta',
    'Efectivo',
    'Cuenta bancaria',
    'Cuenta corriente',
    'Financiera',
    'Cuenta exenta',
    'Cuenta no exenta',
    'Redondeo',
    'Cheque emitido',
    'Conforme emitido',
    'Documento emitido',
    'Tarjeta crédito emitida',
    'Retención emitida',
    'IVA compra',
    'Impuesto compra',
    'Descuento obtenido',
    'Diferencia de cambio acreedor ganancias',
    'Diferencia de cambio acreedor pérdidas',
    'Cheque recibido',
    'Conforme recibido',
    'Documento recibido',
    'Tarjeta crédito recibida',
    'Retención recibida',
    'IVA venta',
    'Impuesto venta',
    'Cheque recibido rebotado',
    'Valor al cobro',
    'Valor en custodia',
    'Descuento concedido'
  ];

  typeSearch = {
    query: '',
    results: [] as string[],
    showDropdown: false
  };

  adjustOptions = [
    'Monetaria',
    'No monetaria',
    'No ajusta'
  ];

  adjustSearch = {
    query: '',
    results: [] as string[],
    showDropdown: false
  };

  capituloOptions = [
    'Activo',
    'Orden activo',
    'Pasivo',
    'Orden Pasivo',
    'Patrimonio',
    'Pérdidas',
    'Ganancias'
  ];

  capituloSearch = {
    query: '',
    results: [] as string[],
    showDropdown: false
  };

  imputacionOptions = [
    'No imputa nunca',
    'Imputar siempre'
  ];

  imputacionSearch = {
    query: '',
    results: [] as string[],
    showDropdown: false
  };

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Si el click no es en el menú contextual, cerrarlo
    if (!target.closest('.context-menu')) {
      this.closeContextMenu();
    }

    // Si el click no es en el group search, cerrar dropdown
    if (!target.closest('.group-search-container')) {
      this.groupSearch.showDropdown = false;
    }

    // Si el click no es en el type search, cerrar dropdown
    if (!target.closest('.type-search-container')) {
      this.typeSearch.showDropdown = false;
    }

    // Si el click no es en el adjust search, cerrar dropdown
    if (!target.closest('.adjust-search-container')) {
      this.adjustSearch.showDropdown = false;
    }

    // Si el click no es en el capitulo search, cerrar dropdown
    if (!target.closest('.capitulo-search-container')) {
      this.capituloSearch.showDropdown = false;
    }

    // Si el click no es en el imputacion search, cerrar dropdown
    if (!target.closest('.imputacion-search-container')) {
      this.imputacionSearch.showDropdown = false;
    }
  }

  accounts: Account[] = [
    {
      code: '1',
      name: 'Activos',
      expanded: false,
      isDefault: true,
      children: [
        {
          code: '1.1',
          name: 'Activos Corrientes',
          expanded: false,
          isDefault: true,
          children: [
            {
              code: '1.1.01',
              name: 'Caja General',
              type: 'Activo',
              isDefault: true
            },
            {
              code: '1.1.02',
              name: 'Bancos',
              type: 'Activo',
              isDefault: true
            },
            {
              code: '1.1.03',
              name: 'Cuentas por Cobrar',
              type: 'Activo',
              isDefault: true,
              children: [
                {
                  code: '1.1.03.01',
                  name: 'Clientes Nacionales',
                  isDefault: true
                },
                {
                  code: '1.1.03.02',
                  name: 'Clientes Extranjeros',
                  isDefault: true
                }
              ]
            }
          ]
        },
        {
          code: '1.2',
          name: 'Activos No Corrientes',
          expanded: false,
          isDefault: true,
          children: [
            {
              code: '1.2.01',
              name: 'Propiedad, Planta y Equipo',
              type: 'Activo',
              isDefault: true
            },
            {
              code: '1.2.02',
              name: 'Intangibles',
              type: 'Activo',
              isDefault: true
            }
          ]
        }
      ]
    },
    {
      code: '2',
      name: 'Pasivos',
      expanded: false,
      isDefault: true,
      children: [
        {
          code: '2.1',
          name: 'Pasivos Corrientes',
          expanded: false,
          isDefault: true,
          children: [
            {
              code: '2.1.01',
              name: 'Proveedores',
              type: 'Pasivo',
              isDefault: true
            },
            {
              code: '2.1.02',
              name: 'Cuentas por Pagar',
              type: 'Pasivo',
              isDefault: true
            }
          ]
        },
        {
          code: '2.2',
          name: 'Pasivos No Corrientes',
          expanded: false,
          isDefault: true,
          children: [
            {
              code: '2.2.01',
              name: 'Préstamos Bancarios',
              type: 'Pasivo',
              isDefault: true
            }
          ]
        }
      ]
    },
    {
      code: '3',
      name: 'Patrimonio',
      expanded: false,
      isDefault: true,
      children: [
        {
          code: '3.1',
          name: 'Capital',
          expanded: false,
          isDefault: true,
          children: [
            {
              code: '3.1.01',
              name: 'Capital Social',
              type: 'Patrimonio',
              isDefault: true
            },
            {
              code: '3.1.02',
              name: 'Reservas',
              type: 'Patrimonio',
              isDefault: true
            }
          ]
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.headerService.setTitle('Plan de Cuentas');
    this.filteredAccounts = this.accounts;

    // Configurar el callback de búsqueda
    this.searchService.setSearchCallback((query: string) => {
      this.searchQuery = query;
      this.filterAccounts(query);
    }, 'Buscar plan de cuenta');
  }

  ngAfterViewInit(): void {
    if (this.actionsTemplate) {
      this.actionsService.setActions(this.actionsTemplate);
    }
  }

  ngOnDestroy(): void {
    this.actionsService.clearActions();
    this.searchService.clearSearchCallback();
  }

  filterAccounts(query: string): void {
    if (!query || query.trim() === '') {
      this.filteredAccounts = this.accounts;
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    this.filteredAccounts = this.filterAccountsRecursive(this.accounts, searchTerm);
  }

  filterAccountsRecursive(accounts: Account[], searchTerm: string): Account[] {
    const filtered: Account[] = [];

    accounts.forEach(account => {
      const matchesCode = account.code.toLowerCase().includes(searchTerm);
      const matchesName = account.name.toLowerCase().includes(searchTerm);

      if (matchesCode || matchesName) {
        // Si coincide, incluir la cuenta con todos sus hijos
        filtered.push({ ...account, expanded: true });
      } else if (account.children && account.children.length > 0) {
        // Si no coincide pero tiene hijos, verificar los hijos
        const filteredChildren = this.filterAccountsRecursive(account.children, searchTerm);
        if (filteredChildren.length > 0) {
          // Si algún hijo coincide, incluir la cuenta padre con los hijos filtrados
          filtered.push({
            ...account,
            children: filteredChildren,
            expanded: true
          });
        }
      }
    });

    return filtered;
  }

  addAccount(): void {
    this.sidePanel = {
      visible: true,
      mode: 'add',
      parentAccount: null,
      formData: {
        group: '',
        code: this.calculateNextRootCode(),
        name: '',
        type: '',
        ajusta: '',
        capitulo: '',
        imputacion: ''
      }
    };
    this.resetGroupSearch();
    this.resetTypeSearch();
    this.resetAdjustSearch();
    this.resetCapituloSearch();
    this.resetImputacionSearch();
    this.saveInitialFormState();
  }

  exportAccounts(): void {
    console.log('Exportar plan de cuentas');
  }

  onContextMenu(event: MouseEvent, account: Account): void {
    event.preventDefault();
    this.contextMenu = {
      visible: true,
      x: event.clientX,
      y: event.clientY,
      account: account
    };
  }

  closeContextMenu(): void {
    this.contextMenu.visible = false;
    this.contextMenu.account = null;
  }

  onAddSubAccount(): void {
    if (this.contextMenu.account) {
      // Expandir la cuenta padre si está colapsada
      if (!this.contextMenu.account.expanded) {
        this.contextMenu.account.expanded = true;
      }

      this.sidePanel = {
        visible: true,
        mode: 'add',
        parentAccount: this.contextMenu.account,
        formData: {
          group: `${this.contextMenu.account.code} - ${this.contextMenu.account.name}`,
          code: this.calculateNextCode(this.contextMenu.account),
          name: '',
          type: '',
          ajusta: '',
          capitulo: '',
          imputacion: ''
        }
      };
      this.groupSearch.selectedGroup = this.contextMenu.account;
      this.groupSearch.query = this.sidePanel.formData.group;
      this.resetTypeSearch();
      this.resetAdjustSearch();
      this.resetCapituloSearch();
      this.resetImputacionSearch();
      this.saveInitialFormState();
    }
    this.closeContextMenu();
  }

  onEditAccount(): void {
    if (this.contextMenu.account && !this.contextMenu.account.isDefault) {
      this.sidePanel = {
        visible: true,
        mode: 'edit',
        parentAccount: null,
        formData: {
          group: '',
          code: this.contextMenu.account.code,
          name: this.contextMenu.account.name,
          type: this.contextMenu.account.type || '',
          ajusta: this.contextMenu.account.ajusta || '',
          capitulo: this.contextMenu.account.capitulo || '',
          imputacion: this.contextMenu.account.imputacion || ''
        }
      };
      this.resetGroupSearch();

      // Establecer tipo en typeSearch si existe
      if (this.contextMenu.account.type) {
        this.typeSearch.query = this.contextMenu.account.type;
      } else {
        this.resetTypeSearch();
      }

      // Establecer ajusta en adjustSearch si existe
      if (this.contextMenu.account.ajusta) {
        this.adjustSearch.query = this.contextMenu.account.ajusta;
      } else {
        this.resetAdjustSearch();
      }

      // Establecer capitulo en capituloSearch si existe
      if (this.contextMenu.account.capitulo) {
        this.capituloSearch.query = this.contextMenu.account.capitulo;
      } else {
        this.resetCapituloSearch();
      }

      // Establecer imputacion en imputacionSearch si existe
      if (this.contextMenu.account.imputacion) {
        this.imputacionSearch.query = this.contextMenu.account.imputacion;
      } else {
        this.resetImputacionSearch();
      }

      this.saveInitialFormState();
    }
    this.closeContextMenu();
  }

  onDeleteAccount(): void {
    if (this.contextMenu.account && !this.contextMenu.account.isDefault) {
      // Verificar si tiene hijos
      if (this.contextMenu.account.children && this.contextMenu.account.children.length > 0) {
        // Abrir side panel con el listado de cuentas a eliminar
        this.deletePanelData.accountToDelete = this.contextMenu.account;
        this.deletePanelData.accountsToDelete = this.getAllChildAccounts(this.contextMenu.account);
        this.sidePanel.visible = true;
        this.sidePanel.mode = 'delete';
      } else {
        // Mostrar modal directamente
        this.confirmModal.visible = true;
        this.confirmModal.type = 'delete';
        this.confirmModal.accountToDelete = this.contextMenu.account;
        this.confirmModal.message = `¿Está seguro de eliminar la cuenta "${this.contextMenu.account.code} - ${this.contextMenu.account.name}"?`;
      }
    }
    this.closeContextMenu();
  }

  getAllChildAccounts(account: Account): Account[] {
    const result: Account[] = [account];

    const traverse = (acc: Account) => {
      if (acc.children) {
        acc.children.forEach(child => {
          result.push(child);
          traverse(child);
        });
      }
    };

    traverse(account);
    return result;
  }

  closeSidePanel(): void {
    // Si está en modo delete, cerrar directamente sin modal
    if (this.sidePanel.mode === 'delete') {
      this.forceCloseSidePanel();
      return;
    }

    // Verificar si hay cambios antes de cerrar
    if (this.hasFormChanges()) {
      this.confirmModal.visible = true;
      this.confirmModal.type = 'cancel';
      this.confirmModal.message = '¿Está seguro de cancelar?';
    } else {
      this.forceCloseSidePanel();
    }
  }

  forceCloseSidePanel(): void {
    this.sidePanel.visible = false;
    this.sidePanel.parentAccount = null;
    this.confirmModal.visible = false;
    this.confirmModal.accountToDelete = null;
    this.deletePanelData.accountToDelete = null;
    this.deletePanelData.accountsToDelete = [];
  }

  onConfirmDeleteFromPanel(): void {
    if (this.deletePanelData.accountToDelete) {
      this.confirmModal.visible = true;
      this.confirmModal.type = 'delete';
      this.confirmModal.accountToDelete = this.deletePanelData.accountToDelete;
      this.confirmModal.message = `¿Está seguro de eliminar la cuenta "${this.deletePanelData.accountToDelete.code} - ${this.deletePanelData.accountToDelete.name}" y todas sus subcuentas?`;
    }
  }

  onConfirmForm(): void {
    if (this.sidePanel.mode === 'add') {
      this.addNewAccount();
    } else {
      this.updateAccount();
    }
    this.forceCloseSidePanel();
  }

  addNewAccount(): void {
    const newAccount: Account = {
      code: this.sidePanel.formData.code,
      name: this.sidePanel.formData.name,
      type: this.sidePanel.formData.type || undefined,
      ajusta: this.sidePanel.formData.ajusta || undefined,
      capitulo: this.sidePanel.formData.capitulo || undefined,
      imputacion: this.sidePanel.formData.imputacion || undefined,
      expanded: false,
      isDefault: false
    };

    if (this.sidePanel.parentAccount) {
      // Agregar como hijo de la cuenta padre
      this.addAccountToParent(this.sidePanel.parentAccount, newAccount);
    } else {
      // Agregar como cuenta raíz
      this.accounts.push(newAccount);
      // Ordenar las cuentas raíz por código
      this.accounts.sort((a, b) => {
        const aCode = parseInt(a.code.split('.')[0], 10);
        const bCode = parseInt(b.code.split('.')[0], 10);
        return aCode - bCode;
      });
    }
  }

  addAccountToParent(parentAccount: Account, newAccount: Account): void {
    if (!parentAccount.children) {
      parentAccount.children = [];
    }
    parentAccount.children.push(newAccount);
    // Ordenar los hijos por código
    parentAccount.children.sort((a, b) => {
      const aParts = a.code.split('.');
      const bParts = b.code.split('.');
      const aLast = parseInt(aParts[aParts.length - 1], 10);
      const bLast = parseInt(bParts[bParts.length - 1], 10);
      return aLast - bLast;
    });
  }

  updateAccount(): void {
    const accountToUpdate = this.findAccountByCode(this.sidePanel.formData.code);
    if (accountToUpdate) {
      accountToUpdate.name = this.sidePanel.formData.name;
      accountToUpdate.type = this.sidePanel.formData.type || undefined;
      accountToUpdate.ajusta = this.sidePanel.formData.ajusta || undefined;
      accountToUpdate.capitulo = this.sidePanel.formData.capitulo || undefined;
      accountToUpdate.imputacion = this.sidePanel.formData.imputacion || undefined;
    }
  }

  findAccountByCode(code: string): Account | null {
    const findRecursive = (accounts: Account[]): Account | null => {
      for (const account of accounts) {
        if (account.code === code) {
          return account;
        }
        if (account.children) {
          const found = findRecursive(account.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findRecursive(this.accounts);
  }

  onCancelForm(): void {
    this.closeSidePanel();
  }

  isFormValid(): boolean {
    return this.sidePanel.formData.name.trim() !== '';
  }

  saveInitialFormState(): void {
    this.initialFormState = {
      group: this.sidePanel.formData.group,
      name: this.sidePanel.formData.name,
      type: this.sidePanel.formData.type,
      ajusta: this.sidePanel.formData.ajusta,
      capitulo: this.sidePanel.formData.capitulo,
      imputacion: this.sidePanel.formData.imputacion,
      parentAccount: this.sidePanel.parentAccount
    };
  }

  hasFormChanges(): boolean {
    // Comparar con el estado inicial
    const formData = this.sidePanel.formData;
    return formData.group !== this.initialFormState.group ||
           formData.name !== this.initialFormState.name ||
           formData.type !== this.initialFormState.type ||
           formData.ajusta !== this.initialFormState.ajusta ||
           formData.capitulo !== this.initialFormState.capitulo ||
           formData.imputacion !== this.initialFormState.imputacion ||
           this.sidePanel.parentAccount !== this.initialFormState.parentAccount;
  }

  onConfirmCancel(): void {
    if (this.confirmModal.type === 'cancel') {
      this.forceCloseSidePanel();
    } else if (this.confirmModal.type === 'delete') {
      this.confirmDelete();
    }
  }

  onContinueEditing(): void {
    this.confirmModal.visible = false;
    this.confirmModal.accountToDelete = null;
  }

  confirmDelete(): void {
    if (this.confirmModal.accountToDelete) {
      this.deleteAccountRecursive(this.accounts, this.confirmModal.accountToDelete);
    }
    this.confirmModal.visible = false;
    this.confirmModal.accountToDelete = null;
    // Si el side panel está en modo delete, cerrarlo también
    if (this.sidePanel.mode === 'delete') {
      this.forceCloseSidePanel();
    }
  }

  deleteAccountRecursive(accounts: Account[], accountToDelete: Account): boolean {
    for (let i = 0; i < accounts.length; i++) {
      if (accounts[i].code === accountToDelete.code) {
        accounts.splice(i, 1);
        return true;
      }
      if (accounts[i].children) {
        const found = this.deleteAccountRecursive(accounts[i].children!, accountToDelete);
        if (found) return true;
      }
    }
    return false;
  }

  toggleAccount(account: Account): void {
    if (account.children && account.children.length > 0) {
      account.expanded = !account.expanded;

      // Si se colapsa, colapsar todos los hijos recursivamente
      if (!account.expanded) {
        this.collapseAllChildren(account);
      }
    }
  }

  private collapseAllChildren(account: Account): void {
    if (account.children) {
      account.children.forEach(child => {
        child.expanded = false;
        this.collapseAllChildren(child);
      });
    }
  }

  // Group Search Methods
  getAllAccounts(): Account[] {
    const result: Account[] = [];

    const traverse = (accounts: Account[]) => {
      accounts.forEach(account => {
        result.push(account);
        if (account.children) {
          traverse(account.children);
        }
      });
    };

    traverse(this.accounts);
    return result;
  }

  onGroupSearchFocus(): void {
    const allAccounts = this.getAllAccounts();
    const query = this.groupSearch.query.toLowerCase().trim();

    if (!query) {
      // Mostrar todas las cuentas cuando no hay búsqueda
      this.groupSearch.results = allAccounts;
    } else {
      // Filtrar si ya hay algo escrito
      this.groupSearch.results = allAccounts.filter(account =>
        account.code.toLowerCase().includes(query) ||
        account.name.toLowerCase().includes(query)
      );
    }

    this.groupSearch.showDropdown = this.groupSearch.results.length > 0;
  }

  onGroupSearchInput(): void {
    const query = this.groupSearch.query.toLowerCase().trim();

    if (!query) {
      // Mostrar todas las cuentas cuando se borra la búsqueda
      this.groupSearch.results = this.getAllAccounts();
      this.groupSearch.showDropdown = true;
      this.groupSearch.selectedGroup = null;
      this.sidePanel.parentAccount = null;
      // Recalcular código de nivel raíz
      this.sidePanel.formData.code = this.calculateNextRootCode();
      return;
    }

    const allAccounts = this.getAllAccounts();
    this.groupSearch.results = allAccounts.filter(account =>
      account.code.toLowerCase().includes(query) ||
      account.name.toLowerCase().includes(query)
    );

    this.groupSearch.showDropdown = this.groupSearch.results.length > 0;
  }

  selectGroup(account: Account): void {
    this.groupSearch.selectedGroup = account;
    this.groupSearch.query = `${account.code} - ${account.name}`;
    this.sidePanel.formData.group = this.groupSearch.query;
    this.sidePanel.parentAccount = account;
    this.groupSearch.showDropdown = false;

    // Calcular el siguiente código automáticamente
    this.sidePanel.formData.code = this.calculateNextCode(account);
  }

  clearGroupSelection(): void {
    this.groupSearch.query = '';
    this.groupSearch.results = [];
    this.groupSearch.showDropdown = false;
    this.groupSearch.selectedGroup = null;
    this.sidePanel.parentAccount = null;
    this.sidePanel.formData.group = '';
    // Recalcular código de nivel raíz
    this.sidePanel.formData.code = this.calculateNextRootCode();
  }

  resetGroupSearch(): void {
    this.groupSearch = {
      query: '',
      results: [],
      showDropdown: false,
      selectedGroup: null
    };
  }

  // Type Search Methods
  onTypeSearchFocus(): void {
    const query = this.typeSearch.query.toLowerCase().trim();

    if (!query) {
      // Mostrar todos los tipos cuando no hay búsqueda
      this.typeSearch.results = [...this.accountTypes];
    } else {
      // Filtrar si ya hay algo escrito
      this.typeSearch.results = this.accountTypes.filter(type =>
        type.toLowerCase().includes(query)
      );
    }

    this.typeSearch.showDropdown = this.typeSearch.results.length > 0;
  }

  onTypeSearchInput(): void {
    const query = this.typeSearch.query.toLowerCase().trim();

    if (!query) {
      // Mostrar todos los tipos cuando se borra la búsqueda
      this.typeSearch.results = [...this.accountTypes];
      this.typeSearch.showDropdown = true;
      this.sidePanel.formData.type = '';
      return;
    }

    this.typeSearch.results = this.accountTypes.filter(type =>
      type.toLowerCase().includes(query)
    );

    this.typeSearch.showDropdown = this.typeSearch.results.length > 0;
  }

  selectType(type: string): void {
    this.typeSearch.query = type;
    this.sidePanel.formData.type = type;
    this.typeSearch.showDropdown = false;
  }

  clearTypeSelection(): void {
    this.typeSearch.query = '';
    this.typeSearch.results = [];
    this.typeSearch.showDropdown = false;
    this.sidePanel.formData.type = '';
  }

  resetTypeSearch(): void {
    this.typeSearch = {
      query: '',
      results: [],
      showDropdown: false
    };
  }

  // Adjust Search Methods
  onAdjustSearchFocus(): void {
    const query = this.adjustSearch.query.toLowerCase().trim();

    if (!query) {
      // Mostrar todas las opciones cuando no hay búsqueda
      this.adjustSearch.results = [...this.adjustOptions];
    } else {
      // Filtrar si ya hay algo escrito
      this.adjustSearch.results = this.adjustOptions.filter(option =>
        option.toLowerCase().includes(query)
      );
    }

    this.adjustSearch.showDropdown = this.adjustSearch.results.length > 0;
  }

  onAdjustSearchInput(): void {
    const query = this.adjustSearch.query.toLowerCase().trim();

    if (!query) {
      // Mostrar todas las opciones cuando se borra la búsqueda
      this.adjustSearch.results = [...this.adjustOptions];
      this.adjustSearch.showDropdown = true;
      this.sidePanel.formData.ajusta = '';
      return;
    }

    this.adjustSearch.results = this.adjustOptions.filter(option =>
      option.toLowerCase().includes(query)
    );

    this.adjustSearch.showDropdown = this.adjustSearch.results.length > 0;
  }

  selectAdjust(option: string): void {
    this.adjustSearch.query = option;
    this.sidePanel.formData.ajusta = option;
    this.adjustSearch.showDropdown = false;
  }

  clearAdjustSelection(): void {
    this.adjustSearch.query = '';
    this.adjustSearch.results = [];
    this.adjustSearch.showDropdown = false;
    this.sidePanel.formData.ajusta = '';
  }

  resetAdjustSearch(): void {
    this.adjustSearch = {
      query: '',
      results: [],
      showDropdown: false
    };
  }

  // Capitulo Search Methods
  onCapituloSearchFocus(): void {
    const query = this.capituloSearch.query.toLowerCase().trim();

    if (!query) {
      // Mostrar todas las opciones cuando no hay búsqueda
      this.capituloSearch.results = [...this.capituloOptions];
    } else {
      // Filtrar si ya hay algo escrito
      this.capituloSearch.results = this.capituloOptions.filter(option =>
        option.toLowerCase().includes(query)
      );
    }

    this.capituloSearch.showDropdown = this.capituloSearch.results.length > 0;
  }

  onCapituloSearchInput(): void {
    const query = this.capituloSearch.query.toLowerCase().trim();

    if (!query) {
      // Mostrar todas las opciones cuando se borra la búsqueda
      this.capituloSearch.results = [...this.capituloOptions];
      this.capituloSearch.showDropdown = true;
      this.sidePanel.formData.capitulo = '';
      return;
    }

    this.capituloSearch.results = this.capituloOptions.filter(option =>
      option.toLowerCase().includes(query)
    );

    this.capituloSearch.showDropdown = this.capituloSearch.results.length > 0;
  }

  selectCapitulo(option: string): void {
    this.capituloSearch.query = option;
    this.sidePanel.formData.capitulo = option;
    this.capituloSearch.showDropdown = false;
  }

  clearCapituloSelection(): void {
    this.capituloSearch.query = '';
    this.capituloSearch.results = [];
    this.capituloSearch.showDropdown = false;
    this.sidePanel.formData.capitulo = '';
  }

  resetCapituloSearch(): void {
    this.capituloSearch = {
      query: '',
      results: [],
      showDropdown: false
    };
  }

  // Imputacion Search Methods
  onImputacionSearchFocus(): void {
    const query = this.imputacionSearch.query.toLowerCase().trim();

    if (!query) {
      // Mostrar todas las opciones cuando no hay búsqueda
      this.imputacionSearch.results = [...this.imputacionOptions];
    } else {
      // Filtrar si ya hay algo escrito
      this.imputacionSearch.results = this.imputacionOptions.filter(option =>
        option.toLowerCase().includes(query)
      );
    }

    this.imputacionSearch.showDropdown = this.imputacionSearch.results.length > 0;
  }

  onImputacionSearchInput(): void {
    const query = this.imputacionSearch.query.toLowerCase().trim();

    if (!query) {
      // Mostrar todas las opciones cuando se borra la búsqueda
      this.imputacionSearch.results = [...this.imputacionOptions];
      this.imputacionSearch.showDropdown = true;
      this.sidePanel.formData.imputacion = '';
      return;
    }

    this.imputacionSearch.results = this.imputacionOptions.filter(option =>
      option.toLowerCase().includes(query)
    );

    this.imputacionSearch.showDropdown = this.imputacionSearch.results.length > 0;
  }

  selectImputacion(option: string): void {
    this.imputacionSearch.query = option;
    this.sidePanel.formData.imputacion = option;
    this.imputacionSearch.showDropdown = false;
  }

  clearImputacionSelection(): void {
    this.imputacionSearch.query = '';
    this.imputacionSearch.results = [];
    this.imputacionSearch.showDropdown = false;
    this.sidePanel.formData.imputacion = '';
  }

  resetImputacionSearch(): void {
    this.imputacionSearch = {
      query: '',
      results: [],
      showDropdown: false
    };
  }

  // Code Generation Methods
  calculateNextRootCode(): string {
    if (this.accounts.length === 0) {
      return '1';
    }

    // Obtener todos los códigos de nivel raíz y encontrar el máximo
    const rootCodes = this.accounts.map(account => {
      const parts = account.code.split('.');
      return parseInt(parts[0], 10);
    });

    const maxCode = Math.max(...rootCodes);
    return (maxCode + 1).toString();
  }

  calculateNextCode(parentAccount: Account): string {
    if (!parentAccount.children || parentAccount.children.length === 0) {
      // No tiene hijos, el primer hijo
      const parentParts = parentAccount.code.split('.');

      // Determinar el formato basado en el nivel
      if (parentParts.length === 1) {
        // Nivel 1 -> 1.1
        return `${parentAccount.code}.1`;
      } else if (parentParts.length === 2) {
        // Nivel 2 -> 1.1.01
        return `${parentAccount.code}.01`;
      } else {
        // Nivel 3+ -> mantener el formato
        return `${parentAccount.code}.01`;
      }
    }

    // Tiene hijos, calcular el siguiente
    const parentCode = parentAccount.code;
    const childCodes = parentAccount.children.map(child => {
      // Extraer la última parte del código
      const parts = child.code.split('.');
      const lastPart = parts[parts.length - 1];
      return parseInt(lastPart, 10);
    });

    const maxChildCode = Math.max(...childCodes);
    const nextNumber = maxChildCode + 1;

    // Determinar el formato basado en el nivel del padre
    const parentParts = parentCode.split('.');

    if (parentParts.length === 1) {
      // Hijos de nivel 1 -> formato simple (1, 2, 3)
      return `${parentCode}.${nextNumber}`;
    } else if (parentParts.length === 2) {
      // Hijos de nivel 2 -> formato con padding (01, 02, 03)
      return `${parentCode}.${nextNumber.toString().padStart(2, '0')}`;
    } else {
      // Nivel 3+ -> mantener formato con padding
      return `${parentCode}.${nextNumber.toString().padStart(2, '0')}`;
    }
  }
}
