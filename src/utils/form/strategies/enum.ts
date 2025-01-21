import type { DMMF as PrismaDMMF } from '@prisma/generator-helper';
import { BaseFieldStrategy } from './base';
import { EnumOption } from '../types';

export class EnumFieldStrategy extends BaseFieldStrategy {
  canHandle(field: PrismaDMMF.Field): boolean {
    const documentation = field.documentation?.trim() || '';
    return documentation.includes('(') && documentation.includes('=');
  }

  getConfig(field: PrismaDMMF.Field) {
    const options = this.parseEnumComment(field.documentation!);
    if (!options) return null;

    return {
      component: 'Select',
      imports: [...this.baseImports, 'Select', 'SelectTrigger', 'SelectValue', 'SelectContent', 'SelectItem'],
      validation: this.createValidation(field),
      extraProps: `
        options={${JSON.stringify(options)}}
        onValueChange={(value) => field.onChange(typeof ${options[0].value} === 'number' ? parseInt(value) : value)}
        value={field.value?.toString()}
      `
    };
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
