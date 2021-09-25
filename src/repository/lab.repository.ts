import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";
import Lab from "../schema/lab.schema";

@Service()
@EntityRepository(Lab)
export class LabRepository extends Repository<Lab> {}