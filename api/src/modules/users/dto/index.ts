import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class addUserRequest {
    @IsString()
    login: string;

    @IsString()
    password: string;
}

export class addUserResponse {
    @IsNumber()
    id: number;

    @IsString()
    login: string;
}

export class createUserDTO {
    user: UserDTO;

    @IsString()
    token: string;
}

export class UserDTO {
    @IsNumber()
    id: number;

    @IsString()
    login: string;

    @IsString()
    password: string;

    token?: string;

    likes: LikeDTO[];
}

export class LikeDTO {
    @IsNumber()
    id: number;

    @IsString()
    cat_id: string;

    @IsDate()
    @Type(() => Date)
    created_at: Date;
}
