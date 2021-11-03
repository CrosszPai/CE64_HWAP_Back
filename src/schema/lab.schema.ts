import { Field, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Assets } from "./assets.schema";
import User from "./user.schema";

@ObjectType()
@Entity()
export class Lab {
  @Field((type) => String)
  @PrimaryGeneratedColumn()
  id?: number;

  @Field((type) => String)
  @Column()
  lab_name?: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  lab_detail?: string;

  @ManyToOne(() => User)
  owner?: User;

  @Field((type) => Boolean)
  @Column({ default: false })
  published?: boolean = false;

  @Field((type) => [Assets])
  @OneToMany(() => Assets, (assets) => assets.lab)
  assets?: Assets[];

  @Field((type) => String)
  @Column({ unique: true, default: "" })
  repo_url?: string;
}

export default Lab;
