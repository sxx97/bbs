import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as ormConfig from '../ormconfig.json';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/postCategory/category.module';
import { PostModule } from './modules/post/post.module';
import { CommentModule } from './modules/comment/comment.module';
import { XunfeiWebSocketModule } from './modules/xunfei/xunfei.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...(ormConfig as TypeOrmModuleOptions),
    }),
    AuthModule,
    CategoryModule,
    PostModule,
    CommentModule,
    XunfeiWebSocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
