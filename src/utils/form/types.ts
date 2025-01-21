import type { DMMF as PrismaDMMF } from '@prisma/generator-helper';

export interface FormFieldConfig {
  component: string;
  imports: string[];
  validation?: string;
  type?: string;
  extraProps?: string;
  skip?: boolean;
  name?: string;
}

export interface FieldTypeStrategy {
  canHandle(field: PrismaDMMF.Field): boolean;
  getConfig(field: PrismaDMMF.Field): FormFieldConfig;
}

export interface EnumOption {
  label: string;
  value: string | number;
}
