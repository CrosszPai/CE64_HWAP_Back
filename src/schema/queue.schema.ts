import { Field, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Working } from "./working.schema";

export enum QueueStatus {
  WAITING = "WAITING",
  WORKING = "WORKING",
  DONE = "DONE",
  CANCELED = "CANCELED",
}

@ObjectType()
@Entity()
export class Queue {
  @Field((type) => String)
  @PrimaryGeneratedColumn()
  id?: string;

  @Field((type) => String)
  @CreateDateColumn()
  created_at?: string;

  @Field((type) => String)
  @UpdateDateColumn()
  updated_at?: string;

  @Field((type) => String)
  @Column()
  status?: string;

  @Field((type) => Working)
  @ManyToOne((type) => Working, { eager: true })
  working?: Working;
}
