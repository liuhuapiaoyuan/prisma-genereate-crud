import type { DMMF as PrismaDMMF } from '@prisma/generator-helper';
import { BaseFieldStrategy } from './base';
import { FormFieldConfig } from '../types';

export class UploadFieldStrategy extends BaseFieldStrategy {
  canHandle(field: PrismaDMMF.Field): boolean {
    const name = field.name.toLowerCase();
    return name.includes('avatar') ||
           name.includes('image') ||
           name.includes('file');
  }

  getConfig(field: PrismaDMMF.Field, model: string): FormFieldConfig {
    return {
      component: 'Upload',
      imports: ['Upload'],
      validation: `z.string()${field.isRequired ? '' : '.optional()'}`,
      extraProps: {
        multiple: field.isList,
      }
    };
  }
}
