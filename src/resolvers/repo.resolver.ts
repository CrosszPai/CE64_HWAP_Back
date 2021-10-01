import { Authorized, Ctx, Query, Resolver } from "type-graphql";
import Repo from "../schema/repo.schema";
import { AppContext } from "../type";
import { App } from "octokit";

@Resolver(Repo)
export class RepoResolver {
  @Authorized()
  @Query((returns) => [Repo])
  async repos(@Ctx() ctx: AppContext) {
    const app = new App({
      appId: process.env.GITHUB_APP_ID as string,
      privateKey: ctx.private_key as string,
    });
    try {

      let ins = await app.octokit.request(
        "GET /users/{username}/installation",
        {
          username: ctx.githubUser?.login as string,
        }
      );
      let appi = await app.getInstallationOctokit(ins.data.id);

      let repo = await appi.request("GET /installation/repositories");
      return repo.data.repositories;
    } catch (error) {
      throw new Error("Please install our apps first.");
    }
  }
}
