import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Permission } from "./permissions.entity";

@Entity({
  name: 'roles'
})
export class Role {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 50,
    unique: true,
    comment: 'The unique role name - Admin, Moderator, User',
  })
  name: string

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date


  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: {
      name: 'role_id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
    },
  })
  permissions: Permission[]
}
