import { Entity, Column, BaseEntity, PrimaryColumn } from 'typeorm'

@Entity()
export class LanguageEntity extends BaseEntity {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @Column('simple-array')
  extensions: string[]
}
