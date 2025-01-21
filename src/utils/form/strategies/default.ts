import type { DMMF as PrismaDMMF } from '@prisma/generator-helper';
import { BaseFieldStrategy } from './base';

export class DefaultFieldStrategy extends BaseFieldStrategy {
  canHandle(field: PrismaDMMF.Field): boolean {
    return true; // 默认策略总是可以处理
  }

  getConfig(field: PrismaDMMF.Field) {
    switch (field.type) {
      case 'Int':
      case 'Float':
        return {
          component: 'Input',
          imports: [...this.baseImports, 'Input'],
          validation: this.createValidation(field, 'number'),
          type: 'number',
          extraProps: 'step="any"'
        };

      case 'Boolean':
        return {
          component: 'Checkbox',
          imports: [...this.baseImports, 'Checkbox'],
          validation: 'z.boolean().default(false)'
        };

      case 'DateTime':
        return {
          component: 'DateTimePicker',
          imports: [...this.baseImports, 'DateTimePicker'],
          validation: this.createValidation(field, 'date')
        };

      case 'String':
        if (field.name.toLowerCase().includes('description')) {
          return {
            component: 'Textarea',
            imports: [...this.baseImports, 'Textarea'],
            validation: this.createValidation(field)
          };
        }
        return {
          component: 'Input',
          imports: [...this.baseImports, 'Input'],
          validation: this.createValidation(field)
        };

      default:
        return {
          component: 'Input',
          imports: [...this.baseImports, 'Input'],
          validation: this.createValidation(field)
        };
    }
  }
}
