import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export function IsCustomNumber() {
  return applyDecorators(
    Type(() => Number),
    IsNumber(),
  );
}
