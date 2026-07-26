import { Type } from 'class-transformer';
import { IsInt, Max, Min, ValidateNested } from 'class-validator';

class AvatarConfigDto {
  @IsInt()
  @Min(0)
  @Max(10)
  skin!: number;

  @IsInt()
  @Min(0)
  @Max(10)
  hair!: number;

  @IsInt()
  @Min(0)
  @Max(10)
  hairColor!: number;

  @IsInt()
  @Min(0)
  @Max(10)
  eyes!: number;

  @IsInt()
  @Min(0)
  @Max(10)
  accessory!: number;

  @IsInt()
  @Min(0)
  @Max(10)
  outfit!: number;

  @IsInt()
  @Min(0)
  @Max(10)
  background!: number;
}

export class UpdateAvatarDto {
  @ValidateNested()
  @Type(() => AvatarConfigDto)
  avatarConfig!: AvatarConfigDto;
}
