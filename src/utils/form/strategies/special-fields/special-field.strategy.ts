import type { DMMF as PrismaDMMF } from '@prisma/generator-helper';
import { BaseFieldStrategy } from '../base';
import { SpecialField } from '../../types';

export class SpecialFieldStrategy extends BaseFieldStrategy {
  canHandle(field: PrismaDMMF.Field): boolean {
    return field.name in SpecialField;
  }

  getConfig(field: PrismaDMMF.Field, model: string) {
    const fieldName = field.name.toLowerCase();
    
    // 用户选择器
    if (fieldName === SpecialField.UserId || fieldName === SpecialField.UserIds) {
      return {
        component: 'SelectPage',
        imports: [...this.baseImports, 'SelectPage'],
        validation: this.createValidation(field, fieldName.endsWith('s') ? 'array' : 'number'),
        extraProps: {
          api: '/api/users',
          labelField: 'name',
          valueField: 'id',
          multiple: fieldName.endsWith('s')
        }
      };
    }

    // 管理员选择器
    if (fieldName === SpecialField.AdminId || fieldName === SpecialField.AdminIds) {
      return {
        component: 'SelectPage',
        imports: [...this.baseImports, 'SelectPage'],
        validation: this.createValidation(field, fieldName.endsWith('s') ? 'array' : 'number'),
        extraProps: {
          api: '/api/admins',
          labelField: 'name',
          valueField: 'id',
          multiple: fieldName.endsWith('s')
        }
      };
    }

    // 分类选择器
    if (fieldName === SpecialField.CategoryId || fieldName === SpecialField.CategoryIds) {
      const category = model.toLowerCase().replace(/_/g, '-');
      return {
        component: 'TreeSelect',
        imports: [...this.baseImports, 'TreeSelect'],
        validation: this.createValidation(field, fieldName.endsWith('s') ? 'array' : 'number'),
        extraProps: {
          api: `/api/${category}/categories`,
          multiple: fieldName.endsWith('s')
        }
      };
    }

    // 权重字段
    if (fieldName === SpecialField.Weigh) {
      return {
        component: 'Input',
        imports: [...this.baseImports, 'Input'],
        type: 'number',
        extraProps: {
          min: 0,
          step: 1
        },
        validation: 'z.number().min(0)'
      };
    }

    // 时间字段
    if ([SpecialField.CreateTime, SpecialField.UpdateTime, SpecialField.DeleteTime].includes(fieldName as SpecialField)) {
      return {
        component: 'DateTimePicker',
        imports: [...this.baseImports, 'DateTimePicker'],
        validation: this.createValidation(field, 'date'),
        extraProps: {
          disabled: true
        }
      };
    }

    // 状态字段
    if (fieldName === SpecialField.Status) {
      const options = this.parseEnumFromDoc(field.documentation);
      return {
        component: 'Select',
        imports: [...this.baseImports, 'Select', 'SelectTrigger', 'SelectValue', 'SelectContent', 'SelectItem'],
        validation: this.createValidation(field),
        extraProps: {
          options
        }
      };
    }

    return null;
  }

  private parseEnumFromDoc(doc?: string): { label: string; value: number }[] {
    if (!doc) return [];
    const match = doc.match(/.*?([0-9]+=[\u4e00-\u9fa5]+,?)+/);
    if (!match) return [];

    return match[0].split(',').map(item => {
      const [value, label] = item.split('=');
      return {
        label: label.trim(),
        value: parseInt(value.trim())
      };
    });
  }
}
