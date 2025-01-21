import type { DMMF as PrismaDMMF } from '@prisma/generator-helper';
import { BaseFieldStrategy } from './base';

export class RichTextFieldStrategy extends BaseFieldStrategy {
  canHandle(field: PrismaDMMF.Field): boolean {
    return field.name.toLowerCase().includes('content');
  }

  getConfig(field: PrismaDMMF.Field) {
    return {
      component: 'Editor',
      imports: [...this.baseImports, 'Editor'],
      validation: this.createValidation(field)
    };
  }
}
