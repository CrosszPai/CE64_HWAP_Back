import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";
import { Queue } from "../schema/queue.schema";

@Service()
@EntityRepository(Queue)
export class QueueRepository extends Repository<Queue> {}

