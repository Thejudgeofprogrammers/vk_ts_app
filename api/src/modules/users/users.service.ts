import {
    HttpException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { addUserRequest, UserDTO } from './dto';
import { User } from './entities/User.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { AddLikeToCatDTO } from '../cats/dto';
import { Like } from './entities/Cats.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,

        @InjectRepository(Like)
        private likesRepository: Repository<Like>,

        private readonly configService: ConfigService,
    ) {}

    async deleteLike(
        token: string,
        cat_id: string,
    ): Promise<{ message: string }> {
        try {
            const user = await this.usersRepository.findOne({
                where: { token },
                relations: ['likes'],
            });

            if (!user) {
                throw new NotFoundException('Пользователь не найден');
            }

            const like = user.likes.find((l) => l.cat_id === cat_id);
            if (!like) {
                throw new NotFoundException('Лайк не найден');
            }

            await this.likesRepository.remove(like);
            return { message: 'Успешно удален' };
        } catch (e) {
            if (e instanceof HttpException) {
                console.error('HTTP ошибка:', e.message);
                throw e;
            }
            console.error('Ошибка в функции deleteLike');
            throw new InternalServerErrorException(e);
        }
    }

    async createUser(data: addUserRequest): Promise<UserDTO> {
        try {
            const passwordHash = await bcrypt.hash(data.password, 10);

            const user = await this.usersRepository.save({
                login: data.login,
                password: passwordHash,
                likes: [],
            });

            if (!user) {
                throw new InternalServerErrorException(
                    'Ошибка создания нового пользователя',
                );
            }

            return user;
        } catch (e) {
            if (e instanceof HttpException) {
                console.error('HTTP ошибка:', e.message);
                throw e;
            }
            console.error('Ошибка в функции createUser');
            throw new InternalServerErrorException(e);
        }
    }

    async findOneByLogin(login: string): Promise<boolean> {
        try {
            const exists = await this.usersRepository.findOne({
                where: { login },
            });

            return exists !== null;
        } catch (e) {
            if (e instanceof HttpException) {
                console.error('HTTP ошибка:', e.message);
                throw e;
            }
            console.error('Ошибка в функции findOneBy');
            throw new InternalServerErrorException(e);
        }
    }

    async findOneByToken(token: string): Promise<UserDTO> {
        try {
            return await this.usersRepository.findOne({
                where: { token },
                relations: ['likes'],
            });
        } catch (e) {
            if (e instanceof HttpException) {
                console.error('HTTP ошибка:', e.message);
                throw e;
            }
            console.error('Ошибка в функции findOneByToken');
            throw new InternalServerErrorException(e);
        }
    }

    async findOneByUserId(user_id: number): Promise<string> {
        try {
            const user = await this.usersRepository.findOne({
                where: { id: user_id },
            });

            if (!user.token) {
                throw new NotFoundException('Пользователь не найден')
            }

            return user.token;
        } catch (e) {
            if (e instanceof HttpException) {
                console.error('HTTP ошибка:', e.message);
                throw e;
            }
            console.error('Ошибка в функции findOneBy');
            throw new InternalServerErrorException(e);
        }
    }

    async addCatToUser(payload: AddLikeToCatDTO) {
        try {
            const user = await this.usersRepository.findOne({
                where: { token: payload.token },
                relations: ['likes'],
            });

            if (!user) {
                throw new NotFoundException('Пользователь не найден');
            }

            const findLike = await this.likesRepository.findOne({
                where: { cat_id: payload.cat_id }
            })

            if (findLike) {
                return { message: 'Лайк уже добавлен' };
            }

            const like = this.likesRepository.create({
                cat_id: payload.cat_id,
                user: user,
            });

            await this.likesRepository.save(like);

            return { message: 'Успешно добавлен' };
        } catch (e) {
            if (e instanceof HttpException) {
                console.error('HTTP ошибка:', e.message);
                throw e;
            }
            console.error('Ошибка в функции addCatToUser');
            throw new InternalServerErrorException(e);
        }
    }

    async saveToken(userId: number, token: string): Promise<string> {
        try {
            await this.usersRepository.update({ id: userId }, { token });

            const checkToken = await this.findOneByUserId(userId);

            if (!checkToken) {
                throw new NotFoundException('Пользователь не найден');
            }

            return token;
        } catch (e) {
            if (e instanceof HttpException) {
                console.error('HTTP ошибка:', e.message);
                throw e;
            }
            console.error('Ошибка в функции findOneBy');
            throw new InternalServerErrorException(e);
        }
    }

    generateToken(userId: number): string {
        const salt = this.configService.get<string>('secret_salt');
        const raw = `${userId}${salt}`;
        return crypto.createHash('sha256').update(raw).digest('hex');
    }
}
