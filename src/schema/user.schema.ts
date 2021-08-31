import { Field, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryColumn } from "typeorm";

@ObjectType()
@Entity()
export class User {
  @Field((type) => String)
  @PrimaryColumn({ unique: true })
  id?: number;

  @Field((type) => String, { nullable: true })
  @Column({ unique: true, nullable: true })
  email?: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field((type) => String, { nullable: true })
  @Column({ type: "date", nullable: true })
  entered_at?: Date;
}

export default User;
