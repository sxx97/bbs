import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../../entity/comment.entity';
import { Repository } from 'typeorm';
import { CommentDto } from './comment.dto';
import { User } from '../../entity/user.entity';
import { Post } from '../../entity/post.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}
  async addComment(userId: number, postId: number, commentData: CommentDto) {
    const comment = new Comment();
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      return { message: '请登录后评论', code: 0 };
    }
    const post = await this.postRepository.findOne({ where: { id: postId } });
    const hasComment = await this.commentRepository.findOneBy({
      content: commentData.content,
    });
    if (hasComment) {
      return { code: 0, message: '该帖子已经存在' };
    }
    comment.post = post;
    Object.assign(comment, commentData);
    comment.created_at = new Date();
    comment.user = user;
    await this.commentRepository.save(comment);
    return { message: '添加成功' };
  }

  async queryCommentsByUser(
    userId: number,
    page: number = 1,
    size: number = 10,
  ) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      return { message: '未查询到帖子', code: 0 };
    }
    return await this.commentRepository.find({
      where: {
        user,
      },
      skip: (page - 1) * size,
      take: size,
      order: {
        created_at: 'DESC', // or "ASC" for ascending order
      },
    });
  }

  async queryComments(page: number = 1, size: number = 10) {
    return await this.commentRepository.find({
      skip: (page - 1) * size,
      take: size,
      order: {
        created_at: 'DESC', // or "ASC" for ascending order
      },
    });
  }

  async deleteComment(id: number) {
    const hasComment = await this.commentRepository.findOneBy({ id });
    if (!hasComment) {
      return { code: 0, message: '未查询到该评论' };
    }
    const deleteRes = await this.commentRepository.delete(hasComment);
    if (deleteRes?.affected > 0) {
      return { message: '删除成功' };
    }
    return { message: '删除失败' };
  }
}
