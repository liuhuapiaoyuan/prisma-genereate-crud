import type { DMMF as PrismaDMMF } from '@prisma/generator-helper';
import { FieldTypeStrategy } from './types';
import { RelationFieldStrategy } from './strategies/relation';
import { EnumFieldStrategy } from './strategies/enum';
import { UploadFieldStrategy } from './strategies/upload';
import { RichTextFieldStrategy } from './strategies/richtext';
import { DefaultFieldStrategy } from './strategies/default';

export class FieldStrategyFactory {
  private strategies: FieldTypeStrategy[];
  private defaultStrategy: FieldTypeStrategy;

  constructor() {
    // 策略的顺序很重要，先检查特殊类型，最后是默认类型
    this.strategies = [
      new RelationFieldStrategy(),
      new EnumFieldStrategy(),
      new UploadFieldStrategy(),
      new RichTextFieldStrategy(),
    ];
    this.defaultStrategy = new DefaultFieldStrategy();
  }

  getStrategy(field: PrismaDMMF.Field): FieldTypeStrategy {
    for (const strategy of this.strategies) {
      if (strategy.canHandle(field)) {
        return strategy;
      }
    }
    return this.defaultStrategy;
  }
}
