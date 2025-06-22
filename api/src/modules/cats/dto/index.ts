import { IsString } from 'class-validator';

export class AddLikeToCatDTO {
    @IsString()
    cat_id: string;

    @IsString()
    token: string;
}
