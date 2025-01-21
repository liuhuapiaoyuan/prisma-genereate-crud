import type { DMMF as PrismaDMMF } from '@prisma/generator-helper';
import { BaseFieldStrategy } from './base';

export class RelationFieldStrategy extends BaseFieldStrategy {
  canHandle(field: PrismaDMMF.Field): boolean {
    return field.relationFromFields?.length > 0;
  }

  getConfig(field: PrismaDMMF.Field) {
    const relatedModel = field.type;
    const relatedField = field.relationFromFields[0];

    return {
      name: relatedField,
      component: 'Select',
      imports: [...this.baseImports, 'Select', 'SelectTrigger', 'SelectValue', 'SelectContent', 'SelectItem'],
      validation: this.createValidation(field),
      extraProps: `
        options={getOptions('${relatedModel.toLowerCase()}', '${field.relationToFields}','name')}
        onValueChange={(value) => field.onChange(parseInt(value))}
        value={field.value?.toString()}
      `
    };
  }
}
