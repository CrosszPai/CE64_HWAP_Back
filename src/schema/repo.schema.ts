import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Repo {
  @Field((type) => ID)
  readonly id?: number;

  @Field((type) => String, { nullable: true })
  readonly name?: string;

  @Field((type) => String)
  readonly url?: string;

  @Field((type) => String)
  readonly html_url?: string;
}

export default Repo;
