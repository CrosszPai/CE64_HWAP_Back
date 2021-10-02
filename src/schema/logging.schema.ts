import { Field, ID, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "./user.schema";

@ObjectType()
@Entity()
export class Logging {
    @Field((type) => ID)
    @PrimaryGeneratedColumn()
    readonly id?: number;

    @Field((type) => String)
    @Column()
    query?: string;

    @Field((type) => User)
    @ManyToOne(() => User)
    user?: User;

    @Field(type => String)
    @CreateDateColumn()
    created_at?: string

}

export default Logging;
