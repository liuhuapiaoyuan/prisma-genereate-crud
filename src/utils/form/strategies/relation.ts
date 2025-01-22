import type { DMMF as PrismaDMMF } from '@prisma/generator-helper';
import { BaseFieldStrategy } from './base';
import { FormFieldConfig } from '../types';

export class RelationFieldStrategy extends BaseFieldStrategy {
  canHandle(field: PrismaDMMF.Field): boolean {
    return field.relationFromFields?.length > 0;
  }

  getConfig(field: PrismaDMMF.Field, model: string): FormFieldConfig {
    return {
      component: 'RelationSelect',
      imports: ['RelationSelect'],
      validation: `z.string()${field.isRequired ? '' : '.optional()'}`,
      extraProps: {
        relationModel: field.type,
        multiple: field.isList
      }
    };
  }
}
