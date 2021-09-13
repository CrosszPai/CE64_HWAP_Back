import { Ctx, Query, Resolver } from "type-graphql";
import Repo from "../schema/repo.schema";
import { AppContext } from "../type";

@Resolver(Repo)
export class RepoResolver {
  @Query((returns) => [Repo])
  async repos(@Ctx() ctx: AppContext) {
    const octokit = ctx.userOctokit;
    return (await octokit?.request("GET /user/repos"))?.data;
  }
}
