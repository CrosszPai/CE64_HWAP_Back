import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class User {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  readonly id?: number;
  
  @Field((type) => String, { nullable: true })
  @Column()
  name?: string;
}

export default User;
