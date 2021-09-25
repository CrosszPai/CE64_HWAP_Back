import assert = require("assert");
import { Arg, Authorized, Mutation, Query, Resolver, Ctx } from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { LabRepository } from "../repository/lab.repository";
import { UserRepository } from "../repository/user.repository";
import Lab from "../schema/lab.schema";
import { Role } from "../schema/user.schema";
import { AppContext } from "../type";

@Service()
@Resolver(Lab)
class LabResolver {
  constructor(
    @InjectRepository() private readonly LabRepository: LabRepository,
    @InjectRepository() private readonly userRepository: UserRepository
  ) { }

  @Query((returns) => Lab)
  async lab(@Arg("id") id: number) {
    return await this.LabRepository.findOne({
      where: {
        id,
      },
    });
  }

  @Authorized()
  @Query((returns) => [Lab])
  async labs() {
    const labs = await this.LabRepository.find();
    return labs;
  }

  @Authorized(Role.instructor)
  @Query((returns) => [Lab])
  async selfLabs(@Ctx() ctx: AppContext) {
    const octokit = ctx.userOctokit;
    assert(octokit,"Unauthorize")
    const githubUser = (await octokit.request("GET /user")).data as any;
    const user = await this.userRepository.findOne({ id: githubUser.id });
    if (user?.id) {
      const labs = await this.LabRepository.find({
        owner: user,
      });
      console.log(labs);

      return labs;
    } else {
      return [];
    }
  }

  @Authorized(Role.instructor)
  @Mutation((returns) => Lab)
  async createLab(
    @Arg("lab_name") lab_name: string,
    @Arg("lab_detail", { description: "lab detail", nullable: true })
    lab_detail: string,
    @Ctx() ctx: AppContext
  ) {
    const octokit = ctx.userOctokit;
    assert(octokit,"Unauthorize")
    const githubUser = (await octokit.request("GET /user")).data as any;
    const user = await this.userRepository.findOne({ id: githubUser.id });
    return await this.LabRepository.save({ lab_name, lab_detail, owner: user });
  }
}

export default LabResolver;
