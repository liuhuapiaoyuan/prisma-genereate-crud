import type { DMMF as PrismaDMMF } from '@prisma/generator-helper';
import path from 'path';
import { Project } from 'ts-morph';

export function generateCrudService(
  project: Project,
  outputDir: string,
  model: PrismaDMMF.Model,
) {
  const dirPath = path.resolve(outputDir, 'services');
  const filePath = path.resolve(dirPath, `${model.name.toLowerCase()}.service.ts`);
  const sourceFile = project.createSourceFile(filePath, undefined, {
    overwrite: true,
  });

  sourceFile.addImportDeclaration({
    moduleSpecifier: '@nestjs/common',
    namedImports: ['Injectable'],
  });

  sourceFile.addImportDeclaration({
    moduleSpecifier: '../base.service',
    namedImports: ['BaseService'],
  });

  sourceFile.addImportDeclaration({
    moduleSpecifier: '@prisma/client',
    namedImports: ['PrismaClient'],
  });

  sourceFile.addClass({
    isExported: true,
    decorators: [{ name: 'Injectable', arguments: [] }],
    name: `${model.name}Service`,
    extends: `BaseService<${model.name}>`,
    ctors: [{
      parameters: [{
        name: 'prisma',
        type: 'PrismaClient',
      }],
      statements: [`super(prisma, '${model.name.toLowerCase()}');`],
    }],
  });

  sourceFile.formatText();
}

export function generateCrudController(
  project: Project,
  outputDir: string,
  model: PrismaDMMF.Model,
) {
  const dirPath = path.resolve(outputDir, 'controllers');
  const filePath = path.resolve(dirPath, `${model.name.toLowerCase()}.controller.ts`);
  const sourceFile = project.createSourceFile(filePath, undefined, {
    overwrite: true,
  });

  sourceFile.addImportDeclaration({
    moduleSpecifier: '@nestjs/common',
    namedImports: ['Controller'],
  });

  sourceFile.addImportDeclaration({
    moduleSpecifier: '../base.controller',
    namedImports: ['BaseController'],
  });

  sourceFile.addImportDeclaration({
    moduleSpecifier: `../services/${model.name.toLowerCase()}.service`,
    namedImports: [`${model.name}Service`],
  });

  sourceFile.addClass({
    isExported: true,
    decorators: [
      { 
        name: 'Controller', 
        arguments: [`'${model.name.toLowerCase()}'`] 
      }
    ],
    name: `${model.name}Controller`,
    extends: `BaseController<${model.name}>`,
    ctors: [{
      parameters: [{
        name: 'service',
        type: `${model.name}Service`,
      }],
      statements: ['super(service);'],
    }],
  });

  sourceFile.formatText();
}
