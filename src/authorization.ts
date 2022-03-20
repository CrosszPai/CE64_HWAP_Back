import { AuthChecker } from "type-graphql";
import User from "./schema/user.schema";
import { AppContext } from "./type";
import { db } from "./utils/db";

export const AppAuthChecker: AuthChecker<AppContext> = async (
  { context },
  roles
) => {
  const repository = db.getRepository(User);
  const octokit = context.userOctokit;
  let githubUser = (await octokit?.request("GET /user"))?.data

  if (!githubUser) {
    return false;
  }
  if (roles.length === 0) {
    return true;
  }

  const user = await repository.findOne({
    where: {
      id: githubUser.id
    }
  });
  if (user?.is_admin) {
    return true;
  }
  if (!user || !user.role) {
    return false;
  }
  return roles.includes(user.role.toString());
};
