import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';

@Entity({
  name: 'impuestos',
})
export class Impuesto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, nullable: false })
  nombre: string;

  @Column({ nullable: false })
  agente: string;

  @OneToMany(() => User, (user) => user.impuesto)
  users: User[];
}
