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
  RelationId,
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

  @Column({ nullable: true })
  name?: string

  @Column({ nullable: true })
  username?: string

  @Column()
  email: string

  @ManyToMany(type => PermissionEntity)
  @JoinTable()
  permissions: PermissionEntity[]

  @ManyToOne(type => ContestEntity, contest => contest.members, { nullable: false })
  contest: ContestEntity

  @RelationId((user: UserEntity) => user.contest)
  contestId: number

  @Column({ nullable: true })
  password?: string

  @Column({ nullable: true })
  signupOtc?: string

  @Column({ nullable: true })
  resetPasswordOtc?: string

  @OneToMany(type => SubmissionEntity, submission => submission.issuer)
  submissions: SubmissionEntity[]
}
