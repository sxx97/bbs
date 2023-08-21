// comment.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Check,
} from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';

@Entity()
@Check(`"isDelete" IN (0, 1)`)
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'tinyint', default: 0, select: false })
  isDelete: 0 | 1 = 0;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;
}
