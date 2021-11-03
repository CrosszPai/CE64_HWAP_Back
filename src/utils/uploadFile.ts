import axios from "axios";
import FormData = require("form-data");
import { FileUpload } from "graphql-upload";
import { fileType } from "../enum/filetype.enum";
import getFilePath from "./getFilePath";

type uploadedType = {
  name: string;
  size: number;
  path: string;
};

async function uploadFile(files: FileUpload[]): Promise<uploadedType[]>;
async function uploadFile(
  files: FileUpload[],
  type: fileType
): Promise<uploadedType[]>;
async function uploadFile(
  files: FileUpload[],
  type: fileType,
  id_of_type?: string
): Promise<uploadedType[]>;

async function uploadFile(
  files: FileUpload[],
  ...option: any
): Promise<uploadedType[]> {
  return await Promise.all(
    files.map(async (file) => {
      const stream = file.createReadStream();
      const form = new FormData();
      form.append("file", stream, Date.now() + file.filename);
      const a = await axios.post(
        `http://filer:8888/${getFilePath(...option)}`,
        form,
        {
          headers: form.getHeaders(),
          method: "POST",
        }
      );
      a.data.path = getFilePath(...option) + a.data.name;

      return a.data as uploadedType;
    })
  );
}

export default uploadFile;
