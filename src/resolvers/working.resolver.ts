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
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { LabRepository } from "../repository/lab.repository";
import { QueueRepository } from "../repository/queue.repository";
import { WorkingRepository } from "../repository/working.repository";
import { Queue, QueueStatus } from "../schema/queue.schema";
import { Working } from "../schema/working.schema";
import { AppContext } from "../type";

@Service()
@Resolver(Working)
class WorkingResolver {
  constructor(
    @InjectRepository() private readonly WorkingRepository: WorkingRepository,
    @InjectRepository() private readonly LabRepository: LabRepository,
    @InjectRepository() private readonly QueueRepository: QueueRepository
  ) {}
  @Authorized()
  @Mutation((returns) => Working)
  async addWorking(
    @Ctx() ctx: AppContext,
    @Arg("lab") lab: string,
    @Arg("repo") repo: string
  ) {
    const target = await this.LabRepository.findOne(lab);
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
