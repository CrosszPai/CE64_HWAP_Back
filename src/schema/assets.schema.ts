import { Field, ObjectType } from "type-graphql";
import { CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import Lab from "./lab.schema";


@ObjectType()
@Entity()
export class Assets {
  @ManyToOne((type) => Lab, (lab) => lab.assets)
  lab?: Lab;

  @Field(type => String)
  @PrimaryColumn()
  url?: string;

  @CreateDateColumn()
  created_at?: Date;
}
