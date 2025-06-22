import { Like } from 'src/modules/users/entities/Cats.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    login: string;

    @Column()
    password: string;

    @Column({ nullable: true, unique: true })
    token: string | null;

    @OneToMany(() => Like, (like) => like.user)
    likes: Like[];
}
