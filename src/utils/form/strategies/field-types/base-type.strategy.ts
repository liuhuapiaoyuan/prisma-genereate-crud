import type { DMMF as PrismaDMMF } from '@prisma/generator-helper';
import { BaseFieldStrategy } from '../base';
import { FieldType } from '../../types';

export class BaseTypeStrategy extends BaseFieldStrategy {
  canHandle(field: PrismaDMMF.Field): boolean {
    return field.type in FieldType;
  }

  getConfig(field: PrismaDMMF.Field) {
    switch (field.type) {
      case FieldType.Int:
        return {
          component: 'Input',
          imports: [...this.baseImports, 'Input'],
          type: 'number',
          extraProps: {
            step: 1
          },
          validation: this.createValidation(field, 'number')
        };

      case FieldType.Float:
      case FieldType.Decimal:
        return {
          component: 'Input',
          imports: [...this.baseImports, 'Input'],
          type: 'number',
          extraProps: {
            step: 'any'
          },
          validation: this.createValidation(field, 'number')
        };

      case FieldType.DateTime:
        return {
          component: 'DateTimePicker',
          imports: [...this.baseImports, 'DateTimePicker'],
          validation: this.createValidation(field, 'date')
        };

      case FieldType.Boolean:
        return {
          component: 'Switch',
          imports: [...this.baseImports, 'Switch'],
          validation: 'z.boolean().default(false)'
        };

      case FieldType.Json:
        return {
          component: 'JsonEditor',
          imports: [...this.baseImports, 'JsonEditor'],
          validation: this.createValidation(field, 'object')
        };

      case FieldType.String:
        if (field.documentation?.includes('autocontent')) {
          return {
            component: 'AutoComplete',
            imports: [...this.baseImports, 'AutoComplete'],
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
