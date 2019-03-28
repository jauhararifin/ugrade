import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, Unique } from 'typeorm'
import { Language } from './Language'

@Entity()
@Unique(['shortId'])
export class Contest {
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

  @ManyToMany(type => Language)
  @JoinTable()
  permittedLanguages: string[]
}
