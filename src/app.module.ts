import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available everywhere
    }),
    TypeOrmModule.forRoot({
     type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'my_database',
      synchronize: process.env.NODE_ENV !== 'production', // Disable in production!
      entities: [],
      migrations: []
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
