import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { name: 'tg_user_id' })
  tgId: string;

  @Column()
  address: string;

  @Column('varchar', { name: 'private_key' })
  privateKey: string;
}
