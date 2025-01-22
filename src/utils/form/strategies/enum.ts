import type { DMMF as PrismaDMMF } from '@prisma/generator-helper';
import { BaseFieldStrategy } from './base';
import { EnumOption, FormFieldConfig } from '../types';

export class EnumFieldStrategy extends BaseFieldStrategy {
  canHandle(field: PrismaDMMF.Field): boolean {
    const documentation = field.documentation?.trim() || '';
    return documentation.includes('(') && documentation.includes('=');
  }

  getConfig(field: PrismaDMMF.Field, model: string): FormFieldConfig {
    return {
      component: 'Select',
      imports: ['Select'],
      validation: `z.enum([${this.getEnumValues(field)}])${field.isRequired ? '' : '.optional()'}`,
      extraProps: {
        options: this.getOptions(field)
      }
    };
  }

  private getEnumValues(field: PrismaDMMF.Field): string {
    const options = this.parseEnumComment(field.documentation!);
    return options.map(option => option.value).join(',');
  }

  private getOptions(field: PrismaDMMF.Field): EnumOption[] {
    return this.parseEnumComment(field.documentation!);
  }

  private parseEnumComment(documentation: string): EnumOption[] | null {
    const match = documentation.match(/.*\((.*?)\)/);
    if (!match) return null;

    const options = match[1].split(',').map(item => {
      const [value, label] = item.split('=');
      return {
        value: isNaN(Number(value)) ? value.trim() : Number(value),
        label: label.trim()
      };
    });

    return options.length > 0 ? options : null;
  }
}
