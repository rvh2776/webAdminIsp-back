import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';

@Entity({
  name: 'servicios',
})
export class Servicio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  agente: string;

  @Column({ nullable: false })
  velocidadBajada: string;

  @Column({ nullable: false })
  velocidadSubida: string;

  @Column({ nullable: false })
  costoConexion: string;

  @Column({ nullable: false })
  abono: string;

  @Column({ nullable: false })
  nombre: string;

  @ManyToOne(() => User, (user) => user.servicios, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  user?: User;
}
