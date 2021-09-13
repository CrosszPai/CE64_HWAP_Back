import { registerEnumType } from "type-graphql";

export enum fileType {
  lab_assets = "lab_assets",
  profile = "profile",
  testing = "testing",
}


registerEnumType(fileType,{
    name:"FileType",
    description:"File type use for generate file path to store"
})