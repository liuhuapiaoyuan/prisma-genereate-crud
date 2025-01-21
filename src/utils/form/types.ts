import type { DMMF as PrismaDMMF } from '@prisma/generator-helper';

export interface FormFieldConfig {
  component: string;
  imports: string[];
  validation?: string;
  type?: string;
  extraProps?: Record<string, any>;
  skip?: boolean;
  name?: string;
  isMultiple?: boolean;
}

export interface FieldTypeStrategy {
  canHandle(field: PrismaDMMF.Field, model: string): boolean;
  getConfig(field: PrismaDMMF.Field, model: string): FormFieldConfig;
}

export interface EnumOption {
  label: string;
  value: string | number;
}

// 字段类型映射
export enum FieldType {
  Int = 'Int',
  Float = 'Float',
  String = 'String',
  DateTime = 'DateTime',
  Boolean = 'Boolean',
  Json = 'Json',
  BigInt = 'BigInt',
  Decimal = 'Decimal',
  Enum = 'Enum'
}

// 特殊字段名称
export enum SpecialField {
  UserId = 'user_id',
  UserIds = 'user_ids',
  AdminId = 'admin_id',
  AdminIds = 'admin_ids',
  CategoryId = 'category_id',
  CategoryIds = 'category_ids',
  Weigh = 'weigh',
  CreateTime = 'createtime',
  UpdateTime = 'updatetime',
  DeleteTime = 'deletetime',
  Status = 'status'
}

// 特殊后缀
export enum SpecialSuffix {
  Time = 'time',
  Image = 'image',
  Images = 'images',
  File = 'file',
  Files = 'files',
  Avatar = 'avatar',
  Avatars = 'avatars',
  Content = 'content',
  Id = '_id',
  Ids = '_ids',
  List = 'list',
  Data = 'data',
  Json = 'json',
  Switch = 'switch',
  Range = 'range',
  Tag = 'tag',
  Tags = 'tags'
}
