import {
    BadRequestException,
    Body,
    ConflictException,
    Controller,
    Headers,
    HttpCode,
    HttpStatus,
    Post,
    Res,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { addUserRequest, addUserResponse } from './dto';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('/user')
    @HttpCode(HttpStatus.CREATED)
    @ApiTags('users')
    @ApiOperation({ summary: 'Добавление пользователя' })
    @ApiResponse({ status: 201, description: 'Successful operation' })
    async addUser(
        @Body() payload: addUserRequest,
        @Res({ passthrough: true }) res: Response,
        @Headers('authorization') authHeader: string,
    ): Promise<addUserResponse> {
        const tokenExists = authHeader?.split(' ')[1];
        if (tokenExists) {
            throw new ConflictException('Пользователь уже зарегистрировался');
        }

        if (!payload.login || !payload.password) {
            throw new BadRequestException('Нет логина или пароля');
        }

        const existing = await this.usersService.findOneByLogin(payload.login);

        if (existing) {
            throw new ConflictException(
                'Пользователь с таким логином уже существует',
            );
        }

        const user = await this.usersService.createUser(payload);

        if (!user) {
            throw new BadRequestException('Пользователь не создан');
        }

        const token = this.usersService.generateToken(user.id);

        await this.usersService.saveToken(user.id, token);

        if (!token) {
            throw new UnauthorizedException('Пользователь не зарегистрирован');
        }

        res.setHeader('X-Auth-Token', token);
        // res.setHeader('Authorization', `Bearer ${token}`);

        return {
            id: user.id,
            login: user.login,
        };
    }
}
