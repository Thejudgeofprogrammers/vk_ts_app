import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../config/config';
import * as path from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';

const envFile = `.env.${process.env.NODE_ENV || 'development'}`;

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: path.resolve(__dirname, '..', '..', envFile),
            isGlobal: true,
            load: [configuration],
        }),
        TypeOrmModule.forRootAsync({
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
            type: 'postgres',
            host: config.get('database.host'),
            port: +config.get('database.port'),
            username: config.get('database.username'),
            password: config.get('database.password'),
            database: config.get('database.name'),
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: true,
        }),
        }),
        CatsModule,
        UsersModule,
    ],
})
export class AppModule {}
