export interface Account {
  code: string;
  name: string;
  type?: string;
  ajusta?: string;
  capitulo?: string;
  imputacion?: string;
  children?: Account[];
  expanded?: boolean;
  isDefault?: boolean;
}
