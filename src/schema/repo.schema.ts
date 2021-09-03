import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Repo {
  @Field((type) => ID)
  readonly id?: number;

  @Field((type) => String, { nullable: true })
  name?: string;
}

export default Repo;
