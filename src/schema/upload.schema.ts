import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class UploadInformation {
  @Field()
  filename?: string;
  @Field()
  mimetype?: string;
  @Field()
  encoding?: string;
}
