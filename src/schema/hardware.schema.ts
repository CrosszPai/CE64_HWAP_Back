import { Field, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

export enum HardwareStatus {
    CREATED = "CREATED",
    IDLE = "IDLE",
    BUSY = "BUSY",
    DOWN = "DOWN"
}

@ObjectType()
@Entity()
export class Hardware {
    @Field(type => String)
    @PrimaryColumn()
    id?: string

    @Field(type => String)
    @CreateDateColumn()
    created_at?: string

    @Field(type => String)
    status?: string

    @Field(type => String, {
        nullable: true
    })
    @Column({ nullable: true })
    working_id?: string
}