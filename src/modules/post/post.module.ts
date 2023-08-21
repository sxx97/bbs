import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../../entity/post.entity';
import { User } from '../../entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User])],
  providers: [PostService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
