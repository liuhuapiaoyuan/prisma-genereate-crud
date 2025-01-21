import type { DMMF as PrismaDMMF } from '@prisma/generator-helper';

interface FormFieldConfig {
  component: string;
  imports: string[];
  validation?: string;
  type?: string;
  extraProps?: string;
  skip?: boolean;
  name?: string;
}

interface EnumOption {
  label: string;
  value: string | number;
}

// 解析枚举注释，格式如："状态(1=草稿,2=发布,3=下架)"
function parseEnumComment(documentation: string): EnumOption[] | null {
  const match = documentation.match(/.*\((.*?)\)/);
  if (!match) return null;

  const options = match[1].split(',').map(item => {
    const [value, label] = item.split('=');
    return {
      value: isNaN(Number(value)) ? value.trim() : Number(value),
      label: label.trim()
    };
  });

  return options.length > 0 ? options : null;
}

// 判断字段类型
function getFieldType(field: PrismaDMMF.Field): string {
  const name = field.name.toLowerCase();
  const documentation = field.documentation?.trim() || '';

  // 检查是否是枚举类型注释
  if (documentation.includes('(') && documentation.includes('=')) {
    const options = parseEnumComment(documentation);
    if (options) return 'enum';
  }

  // 检查字段名称包含特定关键字
  if (name.includes('content')) return 'richtext';
  if (name.includes('avatar')) return 'avatar';
  if (name.includes('image')) {
    return name.endsWith('list') ? 'imageList' : 'image';
  }
  if (name.includes('file')) {
    return name.endsWith('list') ? 'fileList' : 'file';
  }

  return 'default';
}

export function getFieldLabel(field: PrismaDMMF.Field): string {
  const documentation = field.documentation?.replace(/^\/\/\/?\s*/, '').trim() || '';
  // 如果是枚举类型，只返回括号前的文本
  if (documentation.includes('(') && documentation.includes('=')) {
    return documentation.split('(')[0].trim();
  }
  return documentation || field.name;
}

export function getFormFieldConfig(field: PrismaDMMF.Field): FormFieldConfig {
  const baseImports = [
    "FormField",
    "FormItem",
    "FormLabel",
    "FormControl",
    "FormMessage"
  ];

  const fieldLabel = getFieldLabel(field);
  const fieldType = getFieldType(field);

  // 处理关联字段
  if (field.relationFromFields?.length > 0) {
    const relatedModel = field.type;
    const relatedField = field.relationFromFields[0];
    return {
      name: relatedField,
      component: 'Select',
      imports: [...baseImports, 'Select', 'SelectTrigger', 'SelectValue', 'SelectContent', 'SelectItem'],
      validation: field.isRequired ?
        `z.string({ required_error: "${fieldLabel}不能为空" })` :
        'z.string().optional()',
      extraProps: `
        options={getOptions('${relatedModel.toLowerCase()}', '${field.relationToFields}','name')}
        onValueChange={(value) => field.onChange(parseInt(value))}
        value={field.value?.toString()}
      `
    };
  }

  // 根据字段类型返回对应的配置
  switch (fieldType) {
    case 'enum':
      const options = parseEnumComment(field.documentation!);
      return {
        component: 'Select',
        imports: [...baseImports, 'Select', 'SelectTrigger', 'SelectValue', 'SelectContent', 'SelectItem'],
        validation: field.isRequired ?
          `z.string({ required_error: "${fieldLabel}不能为空" })` :
          'z.string().optional()',
        extraProps: `
          options={${JSON.stringify(options)}}
          onValueChange={(value) => field.onChange(typeof ${options![0].value} === 'number' ? parseInt(value) : value)}
          value={field.value?.toString()}
        `
      };

    case 'richtext':
      return {
        component: 'Editor',
        imports: [...baseImports, 'Editor'],
        validation: field.isRequired ?
          `z.string({ required_error: "${fieldLabel}不能为空" })` :
          'z.string().optional()',
      };

    case 'avatar':
      return {
        component: 'AvatarUpload',
        imports: [...baseImports, 'AvatarUpload'],
        validation: field.isRequired ?
          `z.string({ required_error: "${fieldLabel}不能为空" })` :
          'z.string().optional()',
        extraProps: 'aspectRatio="1:1"'
      };

    case 'image':
      return {
        component: 'ImageUpload',
        imports: [...baseImports, 'ImageUpload'],
        validation: field.isRequired ?
          `z.string({ required_error: "${fieldLabel}不能为空" })` :
          'z.string().optional()',
      };

    case 'imageList':
      return {
        component: 'ImageUpload',
        imports: [...baseImports, 'ImageUpload'],
        validation: field.isRequired ?
          `z.array(z.string()).min(1, { message: "${fieldLabel}不能为空" })` :
          'z.array(z.string()).optional()',
        extraProps: 'multiple'
      };

    case 'file':
      return {
        component: 'FileUpload',
        imports: [...baseImports, 'FileUpload'],
        validation: field.isRequired ?
          `z.string({ required_error: "${fieldLabel}不能为空" })` :
          'z.string().optional()',
      };

    case 'fileList':
      return {
        component: 'FileUpload',
        imports: [...baseImports, 'FileUpload'],
        validation: field.isRequired ?
          `z.array(z.string()).min(1, { message: "${fieldLabel}不能为空" })` :
          'z.array(z.string()).optional()',
        extraProps: 'multiple'
      };

    default:
      // 处理基础类型
      switch (field.type) {
        case 'Int':
        case 'Float':
          return {
            component: 'Input',
            imports: [...baseImports, 'Input'],
            validation: field.isRequired ?
              `z.number({ required_error: "${fieldLabel}不能为空" })` :
              'z.number().optional()',
            type: 'number',
            extraProps: 'step="any"'
          };

        case 'Boolean':
          return {
            component: 'Checkbox',
            imports: [...baseImports, 'Checkbox'],
            validation: 'z.boolean().default(false)'
          };

        case 'DateTime':
          return {
            component: 'DateTimePicker',
            imports: [...baseImports, 'DateTimePicker'],
            validation: field.isRequired ?
              `z.date({ required_error: "${fieldLabel}不能为空" })` :
              'z.date().optional()'
          };

        case 'String':
          if (field.name.toLowerCase().includes('description')) {
            return {
              component: 'Textarea',
              imports: [...baseImports, 'Textarea'],
              validation: field.isRequired ?
                `z.string({ required_error: "${fieldLabel}不能为空" })` :
                'z.string().optional()'
            };
          }
          return {
            component: 'Input',
            imports: [...baseImports, 'Input'],
            validation: field.isRequired ?
              `z.string({ required_error: "${fieldLabel}不能为空" })` :
              'z.string().optional()'
          };

        default:
          return {
            component: 'Input',
            imports: [...baseImports, 'Input'],
            validation: field.isRequired ?
              `z.string({ required_error: "${fieldLabel}不能为空" })` :
              'z.string().optional()'
          };
      }
  }
}

export function generateFormField(field: PrismaDMMF.Field): string {
  const config = getFormFieldConfig(field);
  const fieldLabel = getFieldLabel(field);

  // 如果需要跳过该字段
  if (config.skip) {
    return '';
  }

  return `
  <FormField
    control={form.control}
    name="${config.name??field.name}"
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
      // 过滤掉关联对象字段（不是外键的关联字段）
      return !(field.relationName && field.relationFromFields?.length);
    })
    .map(field => {
      const config = getFormFieldConfig(field);
      return `  ${field.name}: ${config.validation}`;
    });

  return `
export const formSchema = z.object({
${schemas.join(',\n')}
});

export type FormValues = z.infer<typeof formSchema>;
`;
}
