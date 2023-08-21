import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Check,
} from 'typeorm';
import { Post } from './post.entity';
import { Comment } from './comment.entity';

@Entity()
@Check(`"isDelete" IN (0, 1)`)
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  account: string;

  @Column()
  name?: string = '';

  @Column()
  email?: string = '';

  @Column()
  phone?: string = '';

  @Column()
  wechatOpenId?: string = '';

  @Column()
  wechatUnionId?: string = '';

  @Column()
  password: string;

  @Column({ type: 'tinyint', default: 1 })
  isDelete: 0 | 1 = 0;

  @Column()
  age?: number = 0;

  @Column()
  passwordSalt: number;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
