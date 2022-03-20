import { Repository } from "typeorm";
import { Queue } from "../schema/queue.schema";

export class QueueRepository extends Repository<Queue> {}

