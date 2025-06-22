import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Headers,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Post,
    UnauthorizedException,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { LikeDTO } from '../users/dto';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

@Controller()
export class CatsController {
    constructor(private readonly catsService: CatsService) {}

    @Get('likes')
    @ApiBearerAuth()
    @ApiTags('cats')
    @ApiOperation({ summary: 'Список лайков' })
    @ApiResponse({ status: 200, description: 'Successful operation' })
    async getCatlikes(
        @Headers('authorization') authHeader: string,
    ): Promise<{ data: LikeDTO[] }> {
        const token = authHeader?.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('Пользователь не зарегистрирован');
        }

        const likes = await this.catsService.getLikes(token);

        if (!likes) {
            throw new NotFoundException('У пользователя нет лайков котов');
        }

        return {
            data: likes,
        };
    }

    @Post('likes')
    @ApiTags('cats')
    @HttpCode(HttpStatus.CREATED)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Добавление лайка' })
    @ApiResponse({ status: 201, description: 'Successful operation' })
    async addLikeToCat(
        @Body() body: { cat_id: string },
        @Headers('authorization') authHeader: string,
    ): Promise<{ message: string }> {
        const { cat_id } = body;
        if (!cat_id) {
            throw new BadRequestException('Ошибка добавления like');
        }

        const token = authHeader?.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('Пользователь не зарегистрирован');
        }

        const { message } = await this.catsService.addLikeToCat({
            cat_id,
            token,
        });

        if (!message) {
            throw new InternalServerErrorException('Ошибка сохранения лайка');
        }

        return { message };
    }

    @Delete('likes/:cat_id')
    @HttpCode(HttpStatus.OK)
    @ApiTags('cats')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Удаление лайка' })
    @ApiResponse({ status: 200, description: 'Successful operation' })
    async deleteLike(
        @Param('cat_id') cat_id: string,
        @Headers('authorization') authHeader: string,
    ): Promise<{ message: string }> {
        if (!cat_id) {
            throw new NotFoundException('Кот не найден по cat_id');
        }

        const token = authHeader?.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('Пользователь не зарегистрирован');
        }

        const { message } = await this.catsService.deleteLike(cat_id, token);
        if (!message) {
            throw new NotFoundException('Лайк не найден');
        }

        return { message };
    }
}
