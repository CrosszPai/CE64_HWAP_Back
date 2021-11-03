import { Octokit } from "octokit";
import User from "./schema/user.schema";
import { User as GithubUser } from '@octokit/webhooks-types/schema'
import { createClient } from "redis";
interface AppContext {
  /**
   * @desc octokit created by user used for interact with github
   */
  userOctokit?: Octokit;

  /**
   * @desc current request user
   */
  user?: User;

  /**
   * @desc current request user github data
   */
  githubUser?: GithubUser;

  private_key?: string

  redis: ReturnType<typeof createClient>
};

interface AppMessage {
  id: string,
  event: string,
  payload: string,
}