import { Field, ObjectType } from "type-graphql";
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { Working } from "./working.schema";

export enum HardwareStatus {
  CREATED = "CREATED",
  IDLE = "IDLE",
  BUSY = "BUSY",
  DOWN = "DOWN",
}

@ObjectType()
@Entity()
export class Hardware {
  @Field((type) => String)
  @PrimaryColumn()
  id?: string;

  @Field((type) => String)
  @CreateDateColumn()
  created_at?: string;

  @Field((type) => String)
  status?: string;

  @Field((type) => String, {
    nullable: true,
  })
  @OneToOne(() => Working, { nullable: true })
  @JoinColumn()
  working?: Working;
}
