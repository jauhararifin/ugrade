import {
  BaseEntity,
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { PermissionEntity } from './PermissionEntity'
import { ContestEntity } from './ContestEntity'
import { SubmissionEntity } from './SubmissionEntity'

@Entity()
@Unique(['email', 'contest'])
@Unique(['username', 'contest'])
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  username: string

  @Column()
  email: string

  @ManyToMany(type => PermissionEntity)
  @JoinTable()
  permissions: PermissionEntity[] | Promise<PermissionEntity[]>

  @ManyToOne(type => ContestEntity, contest => contest.members)
  contest: ContestEntity | Promise<ContestEntity>

  @Column()
  password: string

  @Column()
  signupOtc: string

  @Column()
  resetPasswordOtc: string

  @OneToMany(type => SubmissionEntity, submission => submission.issuer)
  submissions: SubmissionEntity[]
}
