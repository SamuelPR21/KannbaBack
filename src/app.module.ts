import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import {CategoryModule} from "./category/category.module";
import { UsersModule } from './users/users.module';
import { StateModule } from './State/state.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    DatabaseModule,
    CategoryModule,
    UsersModule,
    StateModule,
    TaskModule,
  ],
})
export class AppModule {}
