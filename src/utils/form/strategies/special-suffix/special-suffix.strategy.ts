import type { DMMF as PrismaDMMF } from '@prisma/generator-helper';
import { BaseFieldStrategy } from '../base';
import { SpecialSuffix } from '../../types';

export class SpecialSuffixStrategy extends BaseFieldStrategy {
  canHandle(field: PrismaDMMF.Field): boolean {
    return Object.values(SpecialSuffix).some(suffix => 
      field.name.toLowerCase().endsWith(suffix)
    );
  }

  getConfig(field: PrismaDMMF.Field) {
    const fieldName = field.name.toLowerCase();

    // 时间相关
    if (fieldName.endsWith(SpecialSuffix.Time)) {
      return {
        component: 'DateTimePicker',
        imports: [...this.baseImports, 'DateTimePicker'],
        validation: this.createValidation(field, 'date')
      };
    }

    // 图片相关
    if (fieldName.endsWith(SpecialSuffix.Image) || fieldName.endsWith(SpecialSuffix.Images)) {
      const isMultiple = fieldName.endsWith(SpecialSuffix.Images);
      return {
        component: 'ImageUpload',
        imports: [...this.baseImports, 'ImageUpload'],
        validation: this.createValidation(field, isMultiple ? 'array' : 'string'),
        extraProps: {
          multiple: isMultiple,
          accept: 'image/*'
        }
      };
    }

    // 头像相关
    if (fieldName.endsWith(SpecialSuffix.Avatar) || fieldName.endsWith(SpecialSuffix.Avatars)) {
      const isMultiple = fieldName.endsWith(SpecialSuffix.Avatars);
      return {
        component: 'AvatarUpload',
        imports: [...this.baseImports, 'AvatarUpload'],
        validation: this.createValidation(field, isMultiple ? 'array' : 'string'),
        extraProps: {
          multiple: isMultiple,
          accept: 'image/*',
          aspectRatio: '1:1'
        }
      };
    }

    // 文件相关
    if (fieldName.endsWith(SpecialSuffix.File) || fieldName.endsWith(SpecialSuffix.Files)) {
      const isMultiple = fieldName.endsWith(SpecialSuffix.Files);
      return {
        component: 'FileUpload',
        imports: [...this.baseImports, 'FileUpload'],
        validation: this.createValidation(field, isMultiple ? 'array' : 'string'),
        extraProps: {
          multiple: isMultiple
        }
      };
    }

    // 富文本内容
    if (fieldName.endsWith(SpecialSuffix.Content)) {
      return {
        component: 'Editor',
        imports: [...this.baseImports, 'Editor'],
        validation: this.createValidation(field)
      };
    }

    // 关联ID
    if (fieldName.endsWith(SpecialSuffix.Id) || fieldName.endsWith(SpecialSuffix.Ids)) {
      const isMultiple = fieldName.endsWith(SpecialSuffix.Ids);
      const relationName = fieldName.replace(/_ids?$/, '');
      return {
        component: 'AutoComplete',
        imports: [...this.baseImports, 'AutoComplete'],
        validation: this.createValidation(field, isMultiple ? 'array' : 'string'),
        extraProps: {
          multiple: isMultiple,
          api: `/api/${relationName}s`,
          labelField: 'name',
          valueField: 'id'
        }
      };
    }

    // 列表选择
    if (fieldName.endsWith(SpecialSuffix.List)) {
      const isMultiple = field.type === 'set';
      return {
        component: 'Select',
        imports: [...this.baseImports, 'Select'],
        validation: this.createValidation(field, isMultiple ? 'array' : 'string'),
        extraProps: {
          multiple: isMultiple,
          options: this.parseEnumFromDoc(field.documentation)
        }
      };
    }

    // 选项数据
    if (fieldName.endsWith(SpecialSuffix.Data)) {
      const isMultiple = field.type === 'set';
      return {
        component: isMultiple ? 'Checkbox' : 'Radio',
        imports: [...this.baseImports, isMultiple ? 'Checkbox' : 'Radio'],
        validation: this.createValidation(field, isMultiple ? 'array' : 'string'),
        extraProps: {
          options: this.parseEnumFromDoc(field.documentation)
        }
      };
    }

    // JSON编辑器
    if (fieldName.endsWith(SpecialSuffix.Json)) {
      return {
        component: 'JsonEditor',
        imports: [...this.baseImports, 'JsonEditor'],
        validation: this.createValidation(field, 'object')
      };
    }

    // 开关
    if (fieldName.endsWith(SpecialSuffix.Switch)) {
      return {
        component: 'Switch',
        imports: [...this.baseImports, 'Switch'],
        validation: 'z.boolean().default(false)'
      };
    }

    // 时间范围
    if (fieldName.endsWith(SpecialSuffix.Range)) {
      return {
        component: 'DateRangePicker',
        imports: [...this.baseImports, 'DateRangePicker'],
        validation: this.createValidation(field, 'array')
      };
    }

    // 标签
    if (fieldName.endsWith(SpecialSuffix.Tag) || fieldName.endsWith(SpecialSuffix.Tags)) {
      return {
        component: 'TagInput',
        imports: [...this.baseImports, 'TagInput'],
        validation: this.createValidation(field, 'array')
      };
    }

    return null;
  }

  protected parseEnumFromDoc(documentation?: string) {
    if (!documentation) return [];
    const match = documentation.match(/\((.*)\)/);
    if (!match) return [];
    
    return match[1].split(',').map(item => {
      const [label, value] = item.split('=').map(s => s.trim());
      return { label, value };
    });
  }
}
