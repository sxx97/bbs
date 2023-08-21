import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../../entity/post.entity';
import { Repository } from 'typeorm';
import { PostDto } from './post.dto';
import { User } from '../../entity/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async addPost(userId: number, postData: PostDto) {
    const post = new Post();
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      return { message: '请登录后发布帖子', code: 0 };
    }
    const hasPost = await this.postRepository.findOneBy({
      title: postData.title,
    });
    if (hasPost) {
      return { code: 0, message: '该帖子已经存在' };
    }
    Object.assign(post, postData);
    const date = new Date();
    post.created_at = date;
    post.user = user;
    post.updated_at = date;
    await this.postRepository.save(post);
    return { message: '添加成功' };
  }

  async updatePost(id: number, postData: PostDto) {
    const post = new Post();
    const hasPost = await this.postRepository.findOneBy({ id });
    if (!hasPost) {
      return { code: 0, message: '未查询到该名称' };
    }
    post.id = hasPost.id;
    Object.assign(post, postData);
    post.updated_at = new Date();
    await this.postRepository.update(hasPost, post);
    return { message: '修改成功' };
  }

  async queryPostsByUser(userId: number, page: number = 1, size: number = 10) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      return { message: '未查询到帖子', code: 0 };
    }
    return await this.postRepository.find({
      where: {
        user,
      },
      skip: (page - 1) * size,
      take: size,
      order: {
        updated_at: 'DESC', // or "ASC" for ascending order
      },
    });
  }

  async queryPosts(page: number = 1, size: number = 10) {
    return await this.postRepository.find({
      skip: (page - 1) * size,
      take: size,
      order: {
        updated_at: 'DESC', // or "ASC" for ascending order
      },
    });
  }

  async deletePost(id: number) {
    const hasPost = await this.postRepository.findOneBy({ id });
    if (!hasPost) {
      return { code: 0, message: '未查询到该名称' };
    }
    const deleteRes = await this.postRepository.delete(hasPost);
    if (deleteRes?.affected > 0) {
      return { message: '删除成功' };
    }
    return { message: '删除失败' };
  }
}
