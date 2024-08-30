import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'asistencias',
})
export class Asistencia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  createdAt: Date;

  @Column({ length: 50, nullable: false })
  agente: string;

  @ManyToOne(() => User, (user) => user.asistencias, {
    nullable: false,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ nullable: false })
  diaCliente: string;

  @Column({ nullable: false })
  horarios: string;

  @Column({ nullable: false })
  problema: string;

  @Column({ nullable: false })
  observaciones: string;
}
