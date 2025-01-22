import { EnvValue, GeneratorOptions } from '@prisma/generator-helper';
import { getDMMF, parseEnvValue } from '@prisma/internals';
import { promises as fs } from 'fs';
import path from 'path';
import generateClass from './generate-class';
import generateEnum from './generate-enum';
import { generateHelpersIndexFile } from './generate-helpers';
import { generateEnumsIndexFile, generateModelsIndexFile } from './helpers';
import { project } from './project';
import removeDir from './utils/removeDir';
import { generateCrudForm } from './generate-form';


export async function generate(options: GeneratorOptions) {
  const outputDir = parseEnvValue(options.generator.output as EnvValue);
  await fs.mkdir(outputDir, { recursive: true });
  await removeDir(outputDir, true);

  const prismaClientProvider = options.otherGenerators.find(
    (it) => parseEnvValue(it.provider) === 'prisma-client-js',
  );

  const ddmf = await getDMMF({
    datamodel: options.datamodel,
    previewFeatures: prismaClientProvider?.previewFeatures,
  });

  // 渲染创建表单，更新表单
  // 区分： 特定命名， 基础类型
  // 按照不同的分发，后面可以引入
  // 表格字段的渲染




}
