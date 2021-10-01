import { Field, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@ObjectType()
@Entity()
export class Hardware {
    @Field(type => String)
    @PrimaryColumn()
    id?: string

    @Field(type => String)
    @CreateDateColumn()
    createdAt?: string

    @Field(type => String)
    status?: string

    @Field(type => String)
    @Column()
    working_id?: string
}