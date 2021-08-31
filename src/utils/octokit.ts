import { Octokit } from "octokit";

export function getUserOctokit(token: string) {
  return new Octokit({
    auth: token,
  });
}
