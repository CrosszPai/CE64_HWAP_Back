import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";
import { Assets } from "../schema/assets.schema";

@Service()
@EntityRepository(Assets)
export class AssetsRepository extends Repository<Assets> {}
