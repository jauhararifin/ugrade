import { BaseEntity, PrimaryGeneratedColumn, Entity, ManyToOne, Column, OneToMany, RelationId } from 'typeorm'
import { ProblemEntity } from './ProblemEntity'
import { LanguageEntity } from './LanguageEntity'
import { UserEntity } from './UserEntity'
import { GradingEntity } from './GradingEntity'

@Entity()
export class SubmissionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(type => ProblemEntity, { nullable: false })
  problem: ProblemEntity

  @RelationId((submission: SubmissionEntity) => submission.problem)
  problemId: number

  @ManyToOne(type => LanguageEntity, { nullable: false })
  language: LanguageEntity

  @RelationId((submission: SubmissionEntity) => submission.language)
  languageId: number

  @ManyToOne(type => UserEntity, user => user.submissions, { nullable: false })
  issuer: UserEntity

  @RelationId((submission: SubmissionEntity) => submission.issuer)
  issuerId: number

  @Column()
  issuedAt: Date

  @OneToMany(type => GradingEntity, grading => grading.submission)
  gradings: GradingEntity
}
