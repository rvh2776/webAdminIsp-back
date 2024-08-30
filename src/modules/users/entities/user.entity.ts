// Pourpase: Entity for the user table
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Provincia } from '../../provincias/entities/provincia.entity';
import { Localidad } from '../../localidades/entities/localidades.entity';
import { Equipo } from '../../equipos/entities/equipo.entity';
import { Servicio } from '../../servicios/entities/servicio.entity';
import { Impuesto } from '../../impuestos/entities/impuesto.entity';
import { Factura } from 'src/modules/facturacion/entities/facturacion.entity';
import { Asistencia } from 'src/modules/asistencias/entities/asistencia.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: true, nullable: false })
  activo: boolean;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  createdAt: Date;

  @Column({ length: 50, nullable: false })
  agente: string;

  @Column({
    type: 'varchar',
    nullable: true,
    default: 'https://exmple-image.webp',
  })
  imgUrl: string;

  @Column({ length: 50, nullable: false })
  nombre: string;

  @Column({ type: 'varchar', nullable: false, default: '261' })
  codArea: string;

  @Column({ type: 'varchar', nullable: false })
  telefono: string;

  @Column()
  direccion: string;

  @Column('double precision')
  latitud: number;

  @Column('double precision')
  longitud: number;

  @Column({ length: 20, nullable: false, default: 'DNI' })
  tipoDocum: string;

  @Column({ length: 20, nullable: false, default: '00000000' })
  documento: string;

  @Column({ length: 50, nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ length: 60, nullable: true, default: 'no declarado' })
  razonSocial: string;

  @ManyToOne(() => Impuesto, (impuesto) => impuesto.users, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'impuestoId' })
  impuesto: Impuesto;

  @ManyToOne(() => Provincia, (provincia) => provincia.users, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'provinciaId' })
  provincia: Provincia;

  @ManyToOne(() => Localidad, (localidad) => localidad.users, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'localidadId' })
  localidad: Localidad;

  @Column()
  codigoPostal: string;

  @Column({ nullable: true })
  observaciones: string;

  @OneToMany(() => Equipo, (equipo) => equipo.user, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  equipos: Equipo[];

  @OneToMany(() => Servicio, (servicio) => servicio.user, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  servicios: Servicio[];

  @OneToMany(() => Asistencia, (asistencia) => asistencia.user, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  asistencias: Asistencia[];

  @OneToMany(() => Factura, (factura) => factura.user, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  facturas: Factura[];
}
