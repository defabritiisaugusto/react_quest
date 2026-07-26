import { IsString, IsInt, IsBoolean, Min, Max, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class TestResultBodyDto {
  @IsString()
  description!: string;

  @IsBoolean()
  passed!: boolean;

  @IsString()
  message?: string;
}

export class SubmitSolutionBodyDto {
  @IsString()
  code!: string;

  @IsBoolean()
  passed!: boolean;

  @IsInt()
  @Min(0)
  @Max(100)
  score!: number;

  @IsArray()
  @Type(() => TestResultBodyDto)
  testResults!: TestResultBodyDto[];
}
