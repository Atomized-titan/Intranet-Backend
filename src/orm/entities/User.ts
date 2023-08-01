import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Organization } from "./Organization";
import { Post } from "./Post";
import { Comment } from "./Comment";
import { Like } from "./Like";
import { UserRole } from "../../arch";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: UserRole.User })
  role: UserRole;

  // Other user properties

  @ManyToOne(() => Organization, (organization) => organization.users)
  organization: Organization;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @ManyToMany(() => Post, (post) => post.likes)
  @JoinTable()
  likedPosts: Post[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[]; // <-- This property represents the relationship with comments

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  // Other properties and decorators as needed
}
