import { FileUpload, GraphQLUpload } from "graphql-upload";
import { Arg, ID, Mutation, Resolver } from "type-graphql";
import { fileType } from "../enum/filetype.enum";
import { UploadInformation } from "../schema/upload.schema";
import uploadFile from "../utils/uploadFile";

@Resolver()
export class UploadDev {
  @Mutation(() => UploadInformation, { description: "For testing upload" })
  async uploadFile(
    @Arg("file", () => GraphQLUpload) file: FileUpload,
    @Arg("type", () => fileType, { nullable: true }) type: fileType,
    @Arg("id", () => ID, { nullable: true }) id: string
  ): Promise<UploadInformation> {
    console.log(file);
    
    try {
      await uploadFile([file], type, id);
    } catch (error) {
      console.log(error);
    }
    return file;
  }
}
