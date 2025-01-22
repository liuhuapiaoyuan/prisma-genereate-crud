import type { DMMF as PrismaDMMF } from '@prisma/generator-helper';
import { FieldStrategyFactory } from './field-factory';
import { FormFieldConfig } from './types';

export * from './types';

const factory = new FieldStrategyFactory();

export function getFormFieldConfig(field: PrismaDMMF.Field, model: string): FormFieldConfig {
  const strategy = factory.getStrategy(field, model);
  return strategy.getConfig(field, model);
}

export function generateFormField(field: PrismaDMMF.Field, model: string): string {
  const config = getFormFieldConfig(field, model);
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

export function generateZodSchema(fields: PrismaDMMF.Field[], model: string): string {
  const schemas = fields
    .filter(field => {
      return !(field.relationName && !field.relationFromFields?.length);
    })
    .map(field => {
      const config = getFormFieldConfig(field, model);
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
