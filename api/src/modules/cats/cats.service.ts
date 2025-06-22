import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AddLikeToCatDTO } from './dto';
import { LikeDTO } from '../users/dto';

@Injectable()
export class CatsService {
    constructor(private readonly usersService: UsersService) {}

    async addLikeToCat(payload: AddLikeToCatDTO): Promise<{ message: string }> {
        try {
            const { message } = await this.usersService.addCatToUser(payload);

            return { message };
        } catch (e) {
            if (e instanceof HttpException) {
                console.error('HTTP ошибка:', e.message);
                throw e;
            }
            console.error('Ошибка в функции addLikeToCat');
            throw new InternalServerErrorException(e);
        }
    }

    async getLikes(token: string): Promise<LikeDTO[]> {
        try {
            const user = await this.usersService.findOneByToken(token);

            if (!user) {
                throw new NotFoundException('Пользователь не найден');
            }

            return user.likes;
        } catch (e) {
            if (e instanceof HttpException) {
                console.error('HTTP ошибка:', e.message);
                throw e;
            }
            console.error('Ошибка в функции getLikes');
            throw new InternalServerErrorException(e);
        }
    }

    async deleteLike(
        cat_id: string,
        token: string,
    ): Promise<{ message: string }> {
        try {
            const { message } = await this.usersService.deleteLike(
                token,
                cat_id,
            );

            if (!message) {
                throw new NotFoundException('Лайк не найден');
            }

            return { message };
        } catch (e) {
            if (e instanceof HttpException) {
                console.error('HTTP ошибка:', e.message);
                throw e;
            }
            console.error('Ошибка в функции deleteLike');
            throw new InternalServerErrorException(e);
        }
    }
}
