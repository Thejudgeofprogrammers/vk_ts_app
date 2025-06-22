import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/User.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/Cats.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Like])],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService],
})
export class UsersModule {}
