import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
  name: 'permissions'
})
export class Permission {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 100,
    unique: true,
    comment: 'The unique identifier for the permission - e.g., user:read, user:write',
  })
  code: string

  @Column({
    length: 255,
    comment: 'The permission description',
  })
  description: string

  @CreateDateColumn({
    name: 'created_at'
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at'
  })
  updatedAt: Date
}
