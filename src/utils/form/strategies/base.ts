import type { DMMF as PrismaDMMF } from '@prisma/generator-helper';
import { FieldTypeStrategy, FormFieldConfig } from '../types';

export abstract class BaseFieldStrategy implements FieldTypeStrategy {
  protected baseImports = [
    "FormField",
    "FormItem",
    "FormLabel",
    "FormControl",
    "FormMessage"
  ];

  abstract canHandle(field: PrismaDMMF.Field): boolean;
  abstract getConfig(field: PrismaDMMF.Field): FormFieldConfig;

  protected getFieldLabel(field: PrismaDMMF.Field): string {
    const documentation = field.documentation?.replace(/^\/\/\/?\s*/, '').trim() || '';
    if (documentation.includes('(') && documentation.includes('=')) {
      return documentation.split('(')[0].trim();
    }
    return documentation || field.name;
  }

  protected createValidation(field: PrismaDMMF.Field, type: string = 'string'): string {
    const fieldLabel = this.getFieldLabel(field);
    if (type === 'array') {
      return field.isRequired
        ? `z.array(z.string()).min(1, { message: "${fieldLabel}不能为空" })`
        : 'z.array(z.string()).optional()';
    }
    return field.isRequired
      ? `z.${type}({ required_error: "${fieldLabel}不能为空" })`
      : `z.${type}.optional()`;
  }
}
