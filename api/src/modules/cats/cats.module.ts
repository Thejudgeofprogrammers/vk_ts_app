import { Module } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [UsersModule],
    providers: [CatsService],
    controllers: [CatsController],
})
export class CatsModule {}
