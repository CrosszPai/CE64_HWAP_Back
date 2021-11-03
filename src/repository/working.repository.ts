import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";
import { Working } from "../schema/working.schema";

@Service()
@EntityRepository(Working)
export class WorkingRepository extends Repository<Working> {}
