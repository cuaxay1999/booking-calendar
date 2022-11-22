import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'appoiments' })
export class Appoiments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  date: string;

  @Column()
  time: string;

  @Column()
  user_name: string;

  @Column()
  user_email: string;

  @Column()
  user_phone: string;

  @Column()
  user_ccid: string;

  @Column({ nullable: true })
  accepted_time: string;

  @Column({ nullable: true })
  accepted_date: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 1 })
  status: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
