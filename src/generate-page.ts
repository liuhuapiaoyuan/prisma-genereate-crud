import type { DMMF as PrismaDMMF } from '@prisma/generator-helper';
import path from 'path';
import { Project } from 'ts-morph';

function genereateCrudColumns(model: PrismaDMMF.Model) {
  const columns = model.fields.map(field => {
    console.log("field.documentation",field.documentation)
    // 基础列配置
    const column = {
      id: field.name,
      header: field.documentation?.replace(/^\/\/\/?\s*/, '').trim() || field.name,
      accessorKey: field.name,
    };
    const formatBaseColumn = `
      id: '${field.name}',
      header: '${field.documentation?.replace(/^\/\/\/?\s*/, '').trim() || field.name}',
      accessorKey: '${field.name}',`
    // 根据字段类型添加特定配置
    switch (field.type) {
      case 'DateTime':
        return `{
          ${formatBaseColumn}
          cell: ({ getValue }) => formatDate(getValue()),
          enableSorting: true,
        }`;
      case 'Boolean':
        return `{
          ${formatBaseColumn}
          cell: ({ getValue }) => getValue() ? '是' : '否',
          enableSorting: true,
        }`;
      case 'Int':
      case 'Float':
      case 'Decimal':
        return `{
          ${formatBaseColumn}
          enableSorting: true,
        }`;
      case 'String':
        return `{
          ${formatBaseColumn}
        }`;
      default:
        if (field.relationName) {
          // 关联字段
          return `{
            ${formatBaseColumn}
            cell: ({ getValue }) => getValue()?.name || getValue()?.id,
          }`;
        } else {
          // 普通字段
          return `{
            ${formatBaseColumn}
            cell: ({ getValue }) => getValue(),
            enableSorting: true,
          }`;
        }
    }
  });

  return `export const ${model.name.toLowerCase()}Columns = [
    ${columns.join(',\n    ')}
  ];`;
}

export function genereateCrudPage(
  project: Project,
  outputDir: string,
  model: PrismaDMMF.Model,
) {
  const dirPath = path.resolve(outputDir, 'pages');
  const filePath = path.resolve(dirPath, `${model.name.toLowerCase()}.page.tsx`);
  const sourceFile = project.createSourceFile(filePath, undefined, {
    overwrite: true,
  });

  // 导入依赖
  sourceFile.addImportDeclarations([
    {
      moduleSpecifier: '@tanstack/react-table',
      namedImports: ['createColumnHelper', 'getCoreRowModel', 'useReactTable'],
    },
    {
      moduleSpecifier: '../utils/format',
      namedImports: ['formatDate'],
    },
  ]);

  // 生成列定义
  const columnsCode = genereateCrudColumns(model);
  sourceFile.addStatements(columnsCode);

  // 生成页面组件
  sourceFile.addStatements(`
export default function ${model.name}Page() {
  const table = useReactTable({
    data: [],
    columns: ${model.name.toLowerCase()}Columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">${model.name} 管理</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header.column.columnDef.header?.toString()}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {cell.getValue()?.toString()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}`);

  sourceFile.formatText();
}
