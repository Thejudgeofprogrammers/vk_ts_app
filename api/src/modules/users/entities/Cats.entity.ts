import { User } from 'src/modules/users/entities/User.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Like {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cat_id: string;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
    user: User;
}
