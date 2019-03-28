import { Entity, Column, ManyToMany, JoinTable, Unique, PrimaryColumn } from 'typeorm'
import { LanguageEntity } from './LanguageEntity'

@Entity()
@Unique(['shortId'])
export class ContestEntity {
  @PrimaryColumn()
  id: string

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

  @ManyToMany(to => LanguageEntity)
  @JoinTable()
  permittedLanguages: string[]
}
