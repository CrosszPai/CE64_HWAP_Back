import { Octokit } from "octokit";
import User from "./schema/user.schema";

type AppContext = {
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
  githubUser?: User;
};
