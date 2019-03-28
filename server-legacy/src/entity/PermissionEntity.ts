import { Entity, Column, Unique, BaseEntity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
@Unique(['code'])
export class PermissionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  code: string

  @Column()
  description: string
}
