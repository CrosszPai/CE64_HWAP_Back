import { Repository } from "typeorm";
import { Assets } from "../schema/assets.schema";

export class AssetsRepository extends Repository<Assets> {}
