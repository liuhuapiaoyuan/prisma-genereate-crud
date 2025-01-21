import type { DMMF as PrismaDMMF } from '@prisma/generator-helper';
import { FieldTypeStrategy } from './types';
import { SpecialFieldStrategy } from './strategies/special-fields/special-field.strategy';
import { SpecialSuffixStrategy } from './strategies/special-suffix/special-suffix.strategy';
import { BaseTypeStrategy } from './strategies/field-types/base-type.strategy';

export class FieldStrategyFactory {
  private strategies: FieldTypeStrategy[];

  constructor() {
    // 策略的顺序很重要：
    // 1. 先检查特殊字段名（如 user_id, category_id 等）
    // 2. 再检查特殊后缀（如 *_image, *_content 等）
    // 3. 最后使用基础类型策略
    this.strategies = [
      new SpecialFieldStrategy(),
      new SpecialSuffixStrategy(),
      new BaseTypeStrategy()
    ];
  }

  getStrategy(field: PrismaDMMF.Field, model: string): FieldTypeStrategy {
    for (const strategy of this.strategies) {
      if (strategy.canHandle(field, model)) {
        return strategy;
      }
    }
    return this.strategies[this.strategies.length - 1]; // 返回基础类型策略作为默认
  }

  getFieldConfig(field: PrismaDMMF.Field, model: string) {
    const strategy = this.getStrategy(field, model);
    return strategy.getConfig(field, model);
  }
}
