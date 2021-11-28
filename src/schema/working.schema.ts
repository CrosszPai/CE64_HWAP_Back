import { Field, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import Lab from "./lab.schema";
import { Queue } from "./queue.schema";
import User from "./user.schema";

@ObjectType()
@Entity()
export class Working {
  @Field((type) => String)
  @PrimaryGeneratedColumn()
  id?: string;

  @Field((type) => Lab)
  @ManyToOne((type) => Lab, { nullable: false, eager: true })
  lab?: Lab;

  @Field((type) => String)
  @Column({ unique: true, nullable: false })
  repo_url?: string;

  @Field((type) => String)
  @CreateDateColumn()
  created_at?: string;

  @Field((type) => String)
  status?: string;

  @Field((type) => User)
  @ManyToOne((type) => User, { nullable: false, eager: true })
  owner?: User;

  @OneToMany((type) => Queue, (queue) => queue.working)
  queues?: Queue[];

  @Field((type) => Queue)
  queue?: Queue;
}
