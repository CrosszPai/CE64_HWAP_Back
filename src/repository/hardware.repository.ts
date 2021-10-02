import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";
import { Hardware } from "../schema/hardware.schema";

@Service()
@EntityRepository(Hardware)
export class HardwareRepository extends Repository<Hardware> {}