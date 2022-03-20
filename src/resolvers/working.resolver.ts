import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Repository } from "typeorm";
import Lab from "../schema/lab.schema";
import { Queue, QueueStatus } from "../schema/queue.schema";
import { Working } from "../schema/working.schema";
import { AppContext } from "../type";
import { db } from "../utils/db";

@Resolver(Working)
class WorkingResolver {
  WorkingRepository: Repository<Working>;
  LabRepository: Repository<Lab>;
  QueueRepository: Repository<Queue>;
  constructor() {
    this.WorkingRepository = db.getRepository(Working);
    this.LabRepository = db.getRepository(Lab);
    this.QueueRepository = db.getRepository(Queue);
  }
  @Authorized()
  @Mutation((returns) => Working)
  async addWorking(
    @Ctx() ctx: AppContext,
    @Arg("lab") lab: string,
    @Arg("repo") repo: string
  ) {
    const target = await this.LabRepository.findOne({
      where: {
        lab_name: lab,
      },
    });
    // if target is not exist throw error
    if (!target) {
      throw new Error("Lab not found");
    }
    
    const working = await this.WorkingRepository.save({
      repo_url: repo,
      lab: target,
      owner: ctx.user,
    });

    await this.QueueRepository.save({
      status: QueueStatus.WAITING,
      working,
    });

    return working;
  }

  @Authorized()
  @Query((returns) => [Working])
  async getSelfWorking(@Ctx() ctx: AppContext) {
    return await this.WorkingRepository.find({
      where: { owner: ctx.user },
    });
  }

  @Authorized()
  @Query((returns) => [Working])
  async getAllWorking(@Ctx() ctx: AppContext) {
    return await this.WorkingRepository.find();
  }

  @FieldResolver((returns) => Queue)
  async queue(@Root() working: Working) {
    return await this.QueueRepository.findOne({
      where: { working },
      order: {
        created_at: "DESC",
      },
    });
  }
}

export default WorkingResolver;
