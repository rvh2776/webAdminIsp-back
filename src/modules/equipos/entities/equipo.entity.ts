import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';

@Entity({
  name: 'equipos',
})
export class Equipo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  nombre: string;

  @Column({ nullable: false })
  agente: string;

  @Column({ nullable: true })
  ipPc?: string;

  @Column({ nullable: true })
  ipAp?: string;

  @Column({ nullable: true })
  mascaraSubRed?: string;

  @Column({ nullable: true })
  puertaEnlace?: string;

  @Column({ nullable: true })
  dns1?: string;

  @Column({ nullable: true })
  dns2?: string;

  @Column({ nullable: true })
  nodo?: string;

  @Column({ nullable: false })
  equipo: string;

  @Column({ nullable: true })
  cableMts: string;

  @Column({ nullable: false, unique:true })
  macEquipo: string;

  @Column({ nullable: true })
  antena?: string;

  @ManyToOne(() => User, (user) => user.equipos, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  user?: User;

  @Column({ nullable: false, default: false })
  isInstalled: boolean;

  @Column({ nullable: false, default: true })
  isAvailable: boolean;

  @Column({ nullable: true })
  domicilioInstal: string;

  @Column({ nullable: true })
  localidadInstal: string;

  @Column({ type: 'varchar', nullable: true })
  telefonoInstal: string;

  @Column({ type: 'varchar', nullable: true })
  emailInstal: string;

  @Column({ nullable: true })
  observaciones: string;

  @Column({ nullable: true })
  senalConexion: string;
}
