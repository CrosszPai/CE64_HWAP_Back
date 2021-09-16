import { Field, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
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
}

export default Lab;
