import { Repository } from "typeorm";
import { Hardware } from "../schema/hardware.schema";

export class HardwareRepository extends Repository<Hardware> {}