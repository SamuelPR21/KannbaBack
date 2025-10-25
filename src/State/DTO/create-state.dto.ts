import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateStateDto {
  @IsNotEmpty()
  @IsEnum(['BACKLOG', 'TO_DO', 'DOING', 'DONE'])
  name: string;
}
