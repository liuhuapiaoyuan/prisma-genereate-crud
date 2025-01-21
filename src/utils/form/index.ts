import type { DMMF as PrismaDMMF } from '@prisma/generator-helper';
import { FieldStrategyFactory } from './field-factory';
import { FormFieldConfig } from './types';

export * from './types';

const factory = new FieldStrategyFactory();

export function getFormFieldConfig(field: PrismaDMMF.Field): FormFieldConfig {
  const strategy = factory.getStrategy(field);
  return strategy.getConfig(field);
}

export function generateFormField(field: PrismaDMMF.Field): string {
  const config = getFormFieldConfig(field);
  if (!config) return '';

  const fieldLabel = field.documentation?.replace(/^\/\/\/?\s*/, '').trim() || field.name;

  return `
  <FormField
    control={form.control}
    name="${config.name ?? field.name}"
    render={({ field }) => (
      <FormItem>
        <FormLabel>${fieldLabel}</FormLabel>
        <FormControl>
          <${config.component}
            placeholder="${fieldLabel}"
            ${config.type ? `type="${config.type}"` : ''}
            ${config.extraProps || ''}
            {...field}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />`;
}

export function generateZodSchema(fields: PrismaDMMF.Field[]): string {
  const schemas = fields
    .filter(field => {
      return !(field.relationName && !field.relationFromFields?.length);
    })
    .map(field => {
      const config = getFormFieldConfig(field);
      if (!config) return '';
      return `  ${field.name}: ${config.validation}`;
    })
    .filter(Boolean);

  return `
export const formSchema = z.object({
${schemas.join(',\n')}
});

export type FormValues = z.infer<typeof formSchema>;
`;
  }
