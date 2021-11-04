
// import { Max } from "class-validator";
import { GraphQLUpload, FileUpload } from "graphql-upload";
import { ArgsType, Field } from "type-graphql";

@ArgsType()
export class CreateLabArgs {
  @Field((type) => String)
  // @Max(50)
  lab_name?: string;

  @Field((type) => String)
  // @Max(50)
  lab_detail?: string;

  @Field((type) => [GraphQLUpload])
  // @Max(5)
  assets?: Promise<FileUpload>[];

  @Field((type) => Boolean, { nullable: true, defaultValue: false })
  published?: boolean;

  @Field((type) => String)
  repo_url?: string;
}
