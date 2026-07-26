import { IsString } from 'class-validator';

export class RefreshBodyDto {
  @IsString()
  refreshToken!: string;
}
