import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Samuel,2005',
      database: 'kannbanoo',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,

    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
