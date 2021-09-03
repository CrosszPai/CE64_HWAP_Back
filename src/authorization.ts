import { AuthChecker } from "type-graphql";
import { getRepository } from "typeorm";
import User from "./schema/user.schema";
import { AppContext } from "./type";

export const AppAuthChecker: AuthChecker<AppContext> = async (
  { context },
  roles
) => {
  const repository = getRepository(User);
  const octokit = context.userOctokit;
  let githubUser;
  try {
    githubUser = (await octokit.request("GET /user")).data;
  } catch (error) {
    return false;
  }
  if (roles.length === 0) {
    return true;
  }
  const user = await repository.findOne({ id: githubUser.id });
  if (!user || !user.role) {
    return false;
  }
  return roles.includes(user.role.toString());
};
