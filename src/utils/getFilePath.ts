import { fileType } from "../enum/filetype.enum";

function getFilePath(...args: [fileType, string] | []): string;
function getFilePath(): string;
function getFilePath(type: fileType.testing): string;
function getFilePath(type: fileType.lab_assets, id_of_type: string): string;
function getFilePath(type: fileType.profile, id_of_type: string): string;

function getFilePath(type?: fileType, id_of_type?: string) {
  switch (type) {
    case fileType.lab_assets:
      return `${type}/${id_of_type}/`;
    case fileType.profile:
      return `${type}/${id_of_type}/`;
    default:
      return `${fileType.testing}/${id_of_type ? id_of_type + "/" : ""}`;
  }
}
getFilePath();
export default getFilePath;
