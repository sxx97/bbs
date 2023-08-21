// category.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Check,
} from 'typeorm';
import { Post } from './post.entity';

@Entity()
@Check(`"isDelete" IN (0, 1)`)
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'tinyint', default: 0, select: false })
  isDelete: 0 | 1 = 0;

  @OneToMany(() => Post, (post) => post.category)
  posts: Post[];
}
