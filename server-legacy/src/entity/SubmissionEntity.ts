import { BaseEntity, PrimaryGeneratedColumn, Entity, ManyToOne, Column, OneToMany } from 'typeorm'
import { ProblemEntity } from './ProblemEntity'
import { LanguageEntity } from './LanguageEntity'
import { UserEntity } from './UserEntity'
import { GradingEntity } from './GradingEntity'

@Entity()
export class SubmissionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(type => ProblemEntity, { nullable: false })
  problem: Promise<ProblemEntity>

  @ManyToOne(type => LanguageEntity, { nullable: false })
  language: Promise<LanguageEntity>

  @ManyToOne(type => UserEntity, user => user.submissions, { nullable: false })
  issuer: Promise<UserEntity>

  @Column()
  issuedAt: Date

  @OneToMany(type => GradingEntity, grading => grading.submission)
  gradings: Promise<GradingEntity>
}
