import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { LabRepository } from "../repository/lab.repository";
import { WorkingRepository } from "../repository/working.repository";
import { HardwareStatus } from "../schema/hardware.schema";
import { Working } from "../schema/working.schema";
import { AppContext, AppMessage } from "../type";

@Service()
@Resolver(Working)
class WorkingResolver {
  constructor(
    @InjectRepository() private readonly WorkingRepository: WorkingRepository,
    @InjectRepository() private readonly LabRepository: LabRepository // @InjectRepository() private readonly HardwareRepository: HardwareRepository
  ) {}
  @Authorized()
  @Mutation((returns) => Working)
  async addWorking(
    @Ctx() ctx: AppContext,
    @Arg("lab") lab: string,
    @Arg("repo") repo: string
  ) {
    const target = await this.LabRepository.findOne(lab);
    const keys = await ctx.redis.KEYS("*");
    const items = (await ctx.redis.mGet(keys)).filter(
      (item) => item === HardwareStatus.IDLE
    ) as string[];
    const item: string = items[0];
    await ctx.redis.set(item, HardwareStatus.BUSY);
    console.log(repo);
    
    ctx.websocket.clients.forEach((client) => {
      client.send(
        JSON.stringify({
          id: item,
          event: "income_work",
          payload: repo,
        } as AppMessage)
      );
    });
    return await this.WorkingRepository.save({
      repo_url: repo,
      lab: target,
      owner: ctx.user,
    });
  }
}

export default WorkingResolver;
