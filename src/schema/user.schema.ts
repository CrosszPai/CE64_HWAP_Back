import { Field, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryColumn } from "typeorm";

export enum Role {
  instructor = "instructor",
  student = "student",
}

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

  @Field((type) => String)
  @Column({ type: "enum", nullable: true, enum: Role })
  role?: Role = Role.student;
}

export default User;
