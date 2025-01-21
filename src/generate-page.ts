import type { DMMF as PrismaDMMF } from '@prisma/generator-helper';
import path from 'path';
import { Project } from 'ts-morph';

export function genereateCrudPage(
  project: Project,
  outputDir: string,
  model: PrismaDMMF.Model,
) {
  const dirPath = path.resolve(outputDir, 'app');
  const filePath = path.resolve(dirPath, `${model.name.toLowerCase()}`,'page.tsx');
  const sourceFile = project.createSourceFile(filePath, undefined, {
    overwrite: true,
  });

  //
// 添加一个函数并生成 JSX 代码
  sourceFile.addFunction({
    name: "Page",
    isExported: true,
    statements:[
      `return <Table />;`,  // 这里使用字符串数组来定义函数体
    ]
  });

  sourceFile.formatText();
}
