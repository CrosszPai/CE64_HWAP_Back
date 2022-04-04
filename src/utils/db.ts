import { DataSource } from "typeorm";
import { Assets } from "../schema/assets.schema";
import { Hardware } from "../schema/hardware.schema";
import Lab from "../schema/lab.schema";
import Logging from "../schema/logging.schema";
import { Queue } from "../schema/queue.schema";
import Repo from "../schema/repo.schema";
import { UploadInformation } from "../schema/upload.schema";
import User from "../schema/user.schema";
import { Working } from "../schema/working.schema";

console.log(__dirname)
export const db = new DataSource({
    name: "default",
    type: "postgres",
    url: "postgresql://postgres:1234@db:5432/goshenite",
    entities: [Assets, Hardware, Lab, Logging, Queue, Repo, UploadInformation, User, Working],
    synchronize: true,
})