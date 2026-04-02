import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST').trim(),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME').trim(),
        password: configService.get<string>('DB_PASSWORD').trim(),
        database: configService.get<string>('DB_DATABASE').trim(),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule { }
