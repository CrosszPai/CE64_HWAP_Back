import axios from "axios";
import FormData = require("form-data");
import { FileUpload } from "graphql-upload";
import { fileType } from "../enum/filetype.enum";
import getFilePath from "./getFilePath";

async function uploadFile(files: FileUpload[]): Promise<void>;
async function uploadFile(files: FileUpload[], type: fileType): Promise<void>;
async function uploadFile(
  files: FileUpload[],
  type: fileType,
  id_of_type?: string
): Promise<void>;

async function uploadFile(files: FileUpload[], ...option: any): Promise<void> {
  await Promise.all(
    files.map(async (file) => {
      const stream = file.createReadStream();
      const form = new FormData();
      form.append("file", stream, Date.now() + file.filename);
      return await axios.post(
        `http://filer:8888/${getFilePath(...option)}`,
        form,
        {
          headers: form.getHeaders(),
          method: "POST",
        }
      );
    })
  );
}

export default uploadFile;
