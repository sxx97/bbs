import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostDto } from './post.dto';
import { GetUserId } from '../../common/get-user.decorator';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Get('list')
  @UseGuards(JwtAuthGuard)
  queryPostList(@Query() page: number, @Query() count: number) {
    return this.postService.queryPosts(page, count);
  }

  @Get('list/self')
  @UseGuards(JwtAuthGuard)
  queryPostListByUser(
    @GetUserId() id: number,
    @Query() page: number,
    @Query() count: number,
  ) {
    return this.postService.queryPostsByUser(id, page, count);
  }

  @Post('add')
  @UseGuards(JwtAuthGuard)
  addPost(@GetUserId() userId: number, @Body() data: PostDto) {
    return this.postService.addPost(userId, data);
  }

  @Post('update/:id')
  @UseGuards(JwtAuthGuard)
  updatePost(@Param('id') id: string, @Body() data: PostDto) {
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      throw new Error(`Invalid ID: ${id}`);
    }
    return this.postService.updatePost(numericId, data);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  deletePost(@Param('id') id: string) {
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      throw new Error(`Invalid ID: ${id}`);
    }
    return this.postService.deletePost(numericId);
  }
}
