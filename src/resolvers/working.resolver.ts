import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { LabRepository } from "../repository/lab.repository";
import { WorkingRepository } from "../repository/working.repository";
import { Working } from "../schema/working.schema";
import { AppContext } from "../type";

@Service()
@Resolver(Working)
class WorkingResolver {
  constructor(
    @InjectRepository() private readonly WorkingRepository: WorkingRepository,
    @InjectRepository() private readonly LabRepository: LabRepository,
  ) {}
  @Authorized()
  @Mutation(returns => Working)
  async addWorking(@Ctx() ctx:AppContext, @Arg("lab") lab: string,@Arg("repo") repo: string) {
    const target = await this.LabRepository.findOne(lab);
    
    return await this.WorkingRepository.save({
      repo_url: repo,
      lab: target,
      owner: ctx.user
    });
  }
}

export default WorkingResolver;
