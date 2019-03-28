import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, RelationId } from 'typeorm'
import { SubmissionEntity } from './SubmissionEntity'

export enum Verdict {
  IE = 'IE',
  CE = 'CE',
  RTE = 'RTE',
  MLE = 'MLE',
  TLE = 'TLE',
  WA = 'WA',
  AC = 'AC',
  PENDING = 'PENDING',
}

@Entity()
export class GradingEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(type => SubmissionEntity, submission => submission.gradings, { nullable: false })
  submission?: SubmissionEntity

  @RelationId((grading: GradingEntity) => grading.submission)
  submissionId: number

  @Column()
  issuedAt: string

  @Column({ enum: Verdict, default: Verdict.PENDING })
  verdict: string
}
