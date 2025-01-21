import type { DMMF as PrismaDMMF } from '@prisma/generator-helper';
import path from 'path';
import { Project } from 'ts-morph';
import { getFormFieldConfig, generateFormField, generateZodSchema } from './utils/form-helper';

export function generateCrudForm(
  project: Project,
  outputDir: string,
  model: PrismaDMMF.Model,
) {
  const dirPath = path.resolve(outputDir, 'components');
  const filePath = path.resolve(dirPath, `${model.name.toLowerCase()}-form.tsx`);
  const sourceFile = project.createSourceFile(filePath, undefined, {
    overwrite: true,
  });

  // 收集所有需要的导入
  const imports = new Set(['FormField', 'FormItem', 'FormLabel', 'FormControl', 'FormMessage']);
  model.fields.forEach(field => {
    const config = getFormFieldConfig(field);
    config.imports.forEach(imp => imports.add(imp));
  });

  // 添加导入语句
  sourceFile.addImportDeclarations([
    {
      moduleSpecifier: 'react',
      namedImports: ['useState'],
    },
    {
      moduleSpecifier: '@hookform/resolvers/zod',
      namedImports: ['zodResolver'],
    },
    {
      moduleSpecifier: 'react-hook-form',
      namedImports: ['useForm'],
    },
    {
      moduleSpecifier: 'zod',
      namedImports: ['z'],
    },
    {
      moduleSpecifier: '@/components/ui/form',
      namedImports: Array.from(imports),
    },
    {
      moduleSpecifier: '@/components/ui/button',
      namedImports: ['Button'],
    },
  ]);

  // 生成 Zod schema
  const zodSchema = generateZodSchema([...model.fields]);
  sourceFile.addStatements(zodSchema);

  // 生成表单组件
  sourceFile.addStatements(`
interface ${model.name}FormProps {
  initialData?: any;
  onSubmit: (data: FormValues) => void;
  submitText?: string;
}

export function ${model.name}Form({
  initialData,
  onSubmit,
  submitText = '保存'
}: ${model.name}FormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {},
  });

  const [loading, setLoading] = useState(false);

  async function handleSubmit(data: FormValues) {
    try {
      setLoading(true);
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      ${model.fields.map(field => generateFormField(field)).join('\n      ')}

      <Button type="submit" className="mt-4" disabled={loading}>
        {loading ? '保存中...' : submitText}
      </Button>
    </form>
  );
}`);

  sourceFile.formatText();
}
