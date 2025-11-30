import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Content } from '../content/content.entity';
import { User } from '../user/user.entity';

@Entity()
export class Course extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  dateCreated: Date;

  @OneToMany(() => Content, (content) => content.course)
  contents: Content[];

  @ManyToMany(() => User, (user) => user.enrolledCourses)
  @JoinTable({ name: 'course_enrollments' })
  enrolledUsers: User[];
}
