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
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommentDto } from './comment.dto';
import { GetUserId } from '../../common/get-user.decorator';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get('list')
  @UseGuards(JwtAuthGuard)
  queryCommentList(@Query() page: number, @Query() count: number) {
    return this.commentService.queryComments(page, count);
  }

  @Get('list/post/:id')
  @UseGuards(JwtAuthGuard)
  queryCommentListByPost(
    @Param() id: string,
    @Query() page: number,
    @Query() count: number,
  ) {
    return this.commentService.queryCommentsByPost(
      id ? Number(0) : 0,
      page,
      count,
    );
  }

  @Get('list/self')
  @UseGuards(JwtAuthGuard)
  queryCommentListByUser(
    @GetUserId() id: number,
    @Query() page: number,
    @Query() count: number,
  ) {
    return this.commentService.queryCommentsByUser(id, page, count);
  }

  @Post('add')
  @UseGuards(JwtAuthGuard)
  addComment(
    @GetUserId() userId: number,
    @Body() postId: number,
    @Body() data: CommentDto,
  ) {
    return this.commentService.addComment(userId, postId, data);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  deleteComment(@Param('id') id: string) {
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      throw new Error(`Invalid ID: ${id}`);
    }
    return this.commentService.deleteComment(numericId);
  }
}
