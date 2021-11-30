import { Field, ObjectType } from "type-graphql";
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { Queue } from "./queue.schema";

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

  @Field((type) => Queue, {
    nullable: true,
  })
  @OneToOne(() => Queue, { nullable: true, eager: true })
  @JoinColumn()
  queue?: Queue;
}
