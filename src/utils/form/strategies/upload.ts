import type { DMMF as PrismaDMMF } from '@prisma/generator-helper';
import { BaseFieldStrategy } from './base';

export class UploadFieldStrategy extends BaseFieldStrategy {
  canHandle(field: PrismaDMMF.Field): boolean {
    const name = field.name.toLowerCase();
    return name.includes('avatar') || 
           name.includes('image') || 
           name.includes('file');
  }

  getConfig(field: PrismaDMMF.Field) {
    const name = field.name.toLowerCase();
    const isMultiple = name.endsWith('list');
    
    if (name.includes('avatar')) {
      return {
        component: 'AvatarUpload',
        imports: [...this.baseImports, 'AvatarUpload'],
        validation: this.createValidation(field),
        extraProps: 'aspectRatio="1:1"'
      };
    }

    if (name.includes('image')) {
      return {
        component: 'ImageUpload',
        imports: [...this.baseImports, 'ImageUpload'],
        validation: this.createValidation(field, isMultiple ? 'array' : 'string'),
        extraProps: isMultiple ? 'multiple' : undefined
      };
    }

    if (name.includes('file')) {
      return {
        component: 'FileUpload',
        imports: [...this.baseImports, 'FileUpload'],
        validation: this.createValidation(field, isMultiple ? 'array' : 'string'),
        extraProps: isMultiple ? 'multiple' : undefined
      };
    }

    return null;
  }
}
