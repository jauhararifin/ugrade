import { BaseEntity, Entity, Unique, PrimaryGeneratedColumn, Column, ManyToOne, RelationId } from 'typeorm'
import { ContestEntity } from './ContestEntity'

@Entity()
@Unique(['shortId', 'contest'])
export class ProblemEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  shortId: string

  @Column()
  name: string

  @Column('text')
  statement: string

  @ManyToOne(type => ContestEntity, contest => contest.problems, { nullable: false })
  contest: ContestEntity

  @RelationId((problem: ProblemEntity) => problem.contest)
  contestId: number

  @Column({ default: true })
  disabled: boolean

  @Column()
  order: number

  @Column()
  timeLimit: number

  @Column('float')
  tolerance: number

  @Column()
  memoryLimit: number

  @Column()
  outputLimit: number
}
