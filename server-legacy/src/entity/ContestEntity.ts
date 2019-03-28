import { Entity, Column, ManyToMany, JoinTable, Unique, PrimaryGeneratedColumn } from 'typeorm'
import { LanguageEntity } from './LanguageEntity'

@Entity()
@Unique(['shortId'])
export class ContestEntity {
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

  @ManyToMany(to => LanguageEntity)
  @JoinTable()
  permittedLanguages: string[]
}
