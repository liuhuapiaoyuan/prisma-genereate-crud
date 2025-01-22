import type { DMMF as PrismaDMMF } from '@prisma/generator-helper';
import { BaseFieldStrategy } from './base';
import { FormFieldConfig } from '../types';

export class DefaultFieldStrategy extends BaseFieldStrategy {
  canHandle(field: PrismaDMMF.Field): boolean {
    return true; // 默认策略总是可以处理
  }

  getConfig(field: PrismaDMMF.Field, model: string): FormFieldConfig {
    if (field.type === 'Boolean') {
      return {
        component: 'Switch',
        imports: ['Switch'],
        validation: `z.boolean()${field.isRequired ? '' : '.optional()'}`,
        type: 'boolean',
        extraProps: {
          label: field.name
        }
      };
    }

    return {
      component: 'Input',
      imports: ['Input'],
      validation: `z.string()${field.isRequired ? '' : '.optional()'}`
    };
  }
}
