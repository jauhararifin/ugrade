import { Entity, Column, ManyToMany, JoinTable, Unique, PrimaryGeneratedColumn, BaseEntity, OneToMany } from 'typeorm'
import { LanguageEntity } from './LanguageEntity'
import { UserEntity } from './UserEntity'
import { ProblemEntity } from './ProblemEntity'

@Entity()
@Unique(['shortId'])
export class ContestEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  shortId: string

  @Column()
  shortDescription: string

  @Column()
  description: string

  @Column()
  startTime: Date

  @Column()
  freezed: boolean

  @Column()
  finishTime: Date

  @ManyToMany(type => LanguageEntity)
  @JoinTable()
  permittedLanguages: LanguageEntity[]

  @OneToMany(type => UserEntity, user => user.contest)
  members: UserEntity[]

  @OneToMany(type => ProblemEntity, problem => problem.contest)
  problems: ProblemEntity[]
}
