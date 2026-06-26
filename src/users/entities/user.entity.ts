import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: "users"
})
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 50,
    unique: true,
    comment: 'The unique username of the user, used for login',
  })
  username: string

  @Column({
    length: 100,
    unique: true,
    comment: 'The unique email address of the user',
  })
  email: string

  @Column({
    length: 100,
    select: false, // exclude password from queries by default
    comment: 'The hashed password of the user',
  })
  password: string

  @Column({
    name: 'is_active',
    default: true,
    comment: 'Whether the user is active',
  })
  isActive: boolean

  @CreateDateColumn({
    name: 'created_at',
    comment: 'The creation time of the user',
  })
  createdAt: Date

  @CreateDateColumn({
    name: 'updated_at',
    comment: 'The last update time of the user',
  })
  updatedAt: Date
}
